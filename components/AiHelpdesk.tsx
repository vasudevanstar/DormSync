import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './Modal';
import { ChatBubbleOvalLeftEllipsisIcon, SendIcon, SparklesIcon } from '../constants';
import { generateChatResponse } from '../services/geminiService';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
}

const AiHelpdesk: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    useEffect(() => {
        if(isOpen) {
            setMessages([
                { id: 1, text: "Hello! I'm the DormSync AI assistant. How can I help you with hostel rules or facilities today?", sender: 'ai' }
            ]);
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!userInput.trim()) return;

        const newUserMessage: Message = { id: Date.now(), text: userInput, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const aiResponse = await generateChatResponse(userInput);
            const newAiMessage: Message = { id: Date.now() + 1, text: aiResponse, sender: 'ai' };
            setMessages(prev => [...prev, newAiMessage]);
        } catch (error) {
            const errorMessage: Message = { id: Date.now() + 1, text: "Sorry, I couldn't connect to the AI service.", sender: 'ai' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-8 right-8 bg-gradient-to-r from-secondary to-accent text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-40"
                aria-label="Open AI Helpdesk"
            >
                <ChatBubbleOvalLeftEllipsisIcon />
            </motion.button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="AI Helpdesk" size="lg">
                <div className="flex flex-col h-[60vh]">
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-base-200 dark:bg-neutral-700 rounded-bl-none'}`}>
                                    {msg.sender === 'ai' && (
                                        <div className="flex items-center gap-2 text-xs font-bold text-secondary mb-1">
                                            <SparklesIcon /> AI Assistant
                                        </div>
                                    )}
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-base-200 dark:bg-neutral-700 rounded-bl-none">
                                    <div className="flex items-center gap-2 text-xs font-bold text-secondary mb-1">
                                        <SparklesIcon /> AI Assistant
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse" />
                                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse [animation-delay:0.2s]" />
                                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                            placeholder="Ask about mess timings, rules, etc."
                            className="flex-1 p-3 bg-base-100 dark:bg-neutral-700/50 border border-base-300 dark:border-neutral-600 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                            disabled={isLoading}
                        />
                        <motion.button
                            onClick={handleSend}
                            disabled={isLoading}
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            className="bg-secondary text-white w-12 h-12 rounded-full flex items-center justify-center disabled:opacity-50"
                        >
                            <SendIcon />
                        </motion.button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default AiHelpdesk;