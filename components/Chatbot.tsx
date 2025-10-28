
import React, { useState, useEffect, useRef } from 'react';
import { getChatbotResponse } from '../services/geminiService';
import type { Patient, ChatMessage } from '../types';

interface ChatbotProps {
    patient: Patient;
}

const Chatbot: React.FC<ChatbotProps> = ({ patient }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await getChatbotResponse(patient, [...messages, userMessage], input);
            const modelMessage: ChatMessage = { role: 'model', content: response };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage: ChatMessage = {
                role: 'model',
                content: "I'm sorry, I'm having trouble connecting right now. Please try again later."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col h-[65vh]">
            <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-semibold">Hello! I'm CareBot.</p>
                    <p>How is {patient.name} feeling today?</p>
                </div>

                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl whitespace-pre-wrap ${
                            msg.role === 'user' 
                            ? 'bg-brand-blue text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-brand-text-primary dark:text-brand-text-primary_dark'
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                     <div className="flex justify-start">
                        <div className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-brand-text-primary dark:text-brand-text-primary_dark">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask about ${patient.name}...`}
                    disabled={isLoading}
                    className="flex-grow w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue bg-brand-surface-light dark:bg-gray-700 text-brand-text-primary dark:text-brand-text-primary_dark"
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-brand-blue text-white rounded-full p-3 hover:bg-brand-blue-dark disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors flex-shrink-0"
                    aria-label="Send message"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default Chatbot;
