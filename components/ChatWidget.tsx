'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hi! How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userMessage }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to fetch response');
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
        } catch (error: any) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: error.message || "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Soft Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 h-14 w-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700 transition-all hover:scale-110 z-50"
                >
                    <MessageCircle className="w-8 h-8" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 flex flex-col max-h-[600px] h-[500px] animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-semibold">Support Assistant</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-blue-500 p-1 rounded transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm">
                                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question..."
                                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
