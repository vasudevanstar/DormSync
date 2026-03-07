// Fix: Implement Gemini service functions and correct imports.
import { GoogleGenAI, Type } from "@google/genai";
import { ServiceRequest, OutingRequest, MaintenancePrediction } from '../types';

// The API key MUST be obtained exclusively from the environment variable `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateWardenSummary(
  serviceRequests: ServiceRequest[],
  outingRequests: OutingRequest[]
): Promise<string> {
  const serviceRequestDetails = serviceRequests.length > 0
    ? `Pending Service Requests:
      ${serviceRequests.map(r => `- ${r.category} in Room ${r.roomNumber}: "${r.description}"`).join('\n')}`
    : 'No pending service requests.';

  const outingRequestDetails = outingRequests.length > 0
    ? `Pending Outing/Leave Requests:
      ${outingRequests.map(r => `- ${r.type} for ${r.residentName} (Room ${r.roomNumber}): "${r.purpose}" from ${r.fromDate} to ${r.toDate}.`).join('\n')}`
    : 'No pending outing/leave requests.';

  const prompt = `
    You are an AI assistant for a hostel warden. Provide a concise, actionable summary of the current pending tasks.
    Format your response using Markdown for clarity (e.g., use headings, bullet points).
    Do not use any greetings or closings, just provide the summary.

    Current Pending Items:
    ${serviceRequestDetails}
    ${outingRequestDetails}

    Based on this data, identify any urgent issues or patterns. For example, if multiple issues are on the same floor, mention it.
    Provide a brief, high-level summary followed by a bulleted list of prioritized actions.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating summary with Gemini API:", error);
    throw new Error("Failed to generate AI summary. Please check your API key and network connection.");
  }
}

export async function getMaintenancePredictions(): Promise<MaintenancePrediction[]> {
  const prompt = `
    Analyze historical maintenance data for a large student dormitory and predict 3-5 potential upcoming issues.
    The dorm has 4 wings (A, B, C, D) and 5 floors.
    Common issues are electrical (lighting, fans) and plumbing (leaks, clogs).
    Provide a likelihood score from 0.0 to 1.0 for each prediction.
    For each prediction, provide a concise reasoning and a suggested proactive action.

    Return the response as a JSON array of objects. Each object should have the following structure:
    {
      "id": "a unique identifier string",
      "category": "Electrical" or "Plumbing",
      "floor": a number from 1 to 5,
      "wing": "A", "B", "C", or "D",
      "likelihood": a number between 0.0 and 1.0,
      "reasoning": "a brief explanation for the prediction",
      "suggestedAction": "a concise recommended action"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              category: { type: Type.STRING },
              floor: { type: Type.INTEGER },
              wing: { type: Type.STRING },
              likelihood: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              suggestedAction: { type: Type.STRING },
            },
            required: ['id', 'category', 'floor', 'wing', 'likelihood', 'reasoning', 'suggestedAction'],
          },
        },
      },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as MaintenancePrediction[];
  } catch (error) {
    console.error("Error generating maintenance predictions:", error);
    return [
        { id: 'mock1', category: 'Plumbing', floor: 3, wing: 'B', likelihood: 0.75, reasoning: 'API call failed. This is mock data. Recurring reports of slow drains.', suggestedAction: 'Schedule drain inspection for 3rd-floor bathrooms.'},
        { id: 'mock2', category: 'Electrical', floor: 5, wing: 'A', likelihood: 0.60, reasoning: 'API call failed. This is mock data. Lights in this wing are older models.', suggestedAction: 'Check and replace flickering fluorescent lights.'},
    ];
  }
}

export async function generateChatResponse(message: string): Promise<string> {
    const prompt = message;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: `You are DormSync AI, a friendly and helpful AI assistant for residents of the M kumarasamy college of Engineering hostel. Your primary role is to answer questions about hostel facilities, rules, and procedures.
                
                Key Information to know:
                - **Mess Timings**: Breakfast (7:00 AM - 9:00 AM), Lunch (12:30 PM - 2:00 PM), Dinner (7:30 PM - 9:00 PM). The weekly menu is available in the 'Mess Menu' section of the app.
                - **Outing & Curfew**: The main gate closes at 9:30 PM on weekdays and 10:00 PM on weekends. All outings and leaves must be requested through the app. Emergency leave requires immediate warden notification.
                - **Service Requests**: For any room issues (plumbing, electrical, carpentry), raise a request via the 'Service Request' feature. You can attach a photo for clarity.
                - **Guest Policy**: Guests are permitted only in the designated visitor's lounge between 9:00 AM and 6:00 PM. Visitors must sign in at the front desk. Overnight guests are strictly not allowed.
                - **Wi-Fi**: High-speed Wi-Fi is available throughout the hostel. Use your student ID to log in. Peer-to-peer file sharing is restricted.
                - **Laundry**: The laundry facility is on the ground floor, open from 6:00 AM to 10:00 PM. Tokens can be purchased at the warden's office during office hours.
                - **Study Hall**: The common study hall on the first floor is open 24/7. Please maintain silence.
                - **Room Rules**: Use of heavy electrical appliances like heaters or electric stoves is forbidden. Always lock your room when you leave. Keep your room clean.
                - **Emergency Contact**: For any emergency, medical or otherwise, contact the warden's office immediately at extension 6181 or the security desk at 6182.

                Your tone should be conversational, helpful, and concise. If you don't know an answer, politely state that you don't have that information and suggest contacting the warden's office. Do not make up information.`
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error getting chat response from Gemini API:", error);
        return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
    }
}

export async function generateOutingSuggestion(request: OutingRequest): Promise<string> {
    // In a real app, you would fetch the resident's history from a database.
    const mockHistory = {
        totalOutings: Math.floor(Math.random() * 20),
        onTimeReturns: Math.floor(Math.random() * 18),
        lateReturns: Math.floor(Math.random() * 2),
    };

    const prompt = `
    Based on the following outing request and resident's history, provide a brief suggestion for the warden.
    The suggestion should be one of: "Recommend Approval", "Recommend Review", or "Recommend Caution".
    Follow the recommendation with a one-sentence justification.

    Request:
    - Type: ${request.type}
    - Purpose: ${request.purpose}
    - Duration: From ${request.fromDate} to ${request.toDate}

    Resident History:
    - Total Outings: ${mockHistory.totalOutings}
    - On-Time Returns: ${mockHistory.onTimeReturns}
    - Late Returns: ${mockHistory.lateReturns}

    Example Output: "Recommend Approval: Resident has a consistent record of on-time returns."
    Example Output: "Recommend Review: Purpose is vague for a multi-day leave."
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating outing suggestion:", error);
        return "Could not generate AI suggestion.";
    }
}