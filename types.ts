// Fix: Populate types.ts with necessary type definitions for the application.
export enum Role {
  RESIDENT = 'resident',
  WARDEN = 'warden',
  TECHNICIAN = 'technician',
}

export enum RequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

export interface ServiceRequest {
  id: string;
  residentName: string;
  roomNumber: string;
  floor: number;
  category: 'Electrical' | 'Plumbing' | 'Carpentry' | 'Other';
  description: string;
  status: RequestStatus;
  createdAt: string;
  technicianId?: string;
  imageUrl?: string;
  completionImageUrl?: string;
}

export interface OutingRequest {
  id: string;
  residentName: string;
  roomNumber: string;
  type: 'Outing' | 'Leave' | 'Emergency Leave';
  purpose: string;
  fromDate: string;
  toDate: string;
  fromTime: string;
  toTime: string;
  status: RequestStatus;
  checkOut?: string;
  checkIn?: string;
}

export interface Technician {
    id: string;
    name: string;
    status: 'Online' | 'Offline';
}

export interface MaintenancePrediction {
    id: string;
    category: 'Electrical' | 'Plumbing' | 'Carpentry' | 'Other';
    floor: number;
    wing: 'A' | 'B' | 'C' | 'D';
    likelihood: number;
    reasoning: string;
    suggestedAction: string;
}

export interface GroupBookingMember {
  residentId: string;
  name: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Expired';
}

export interface GroupBooking {
  id: string;
  roomType: '2-Person Sharing' | '4-Person Sharing';
  creatorId: string;
  members: GroupBookingMember[];
  status: 'PendingConfirmation' | 'Confirmed' | 'Expired' | 'Cancelled';
  expiresAt: string; // ISO String
}

export interface Resident {
  id: string;
  name: string;
  roomNumber: string;
  phone: string;
  email: string;
}