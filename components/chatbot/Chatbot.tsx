
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, User, Sparkles } from 'lucide-react';
import type { ChatMessage, Property } from '../../types';
import { continueChat } from '../../services/geminiService';
import { getAllProperties } from '../../services/propertyService';
import LoadingSpinner from '../ui/LoadingSpinner';
import { MOCK_PROPERTIES } from '../../utils/constants';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchProperties = useCallback(async () => {
    // In a real app, this might be fetched on demand or cached
    if (properties.length === 0) {
        setProperties(MOCK_PROPERTIES);
    }
  }, [properties.length]);

  useEffect(() => {
    if (isOpen) {
      fetchProperties();
      if (messages.length === 0) {
        setMessages([
          { sender: 'bot', text: 'Olá! Sou seu assistente imobiliário inteligente. Como posso te ajudar a encontrar o imóvel perfeito?' }
        ]);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponseText = await continueChat(messages, input, properties);
      const botMessage: ChatMessage = { sender: 'bot', text: botResponseText };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { sender: 'bot', text: 'Desculpe, ocorreu um erro. Tente novamente.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primary-500 text-white p-4 rounded-full shadow-lg"
        >
          {isOpen ? <X size={24} /> : <Bot size={24} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-20 right-5 w-[90vw] max-w-sm h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            <div className="p-4 bg-primary-500 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg font-heading flex items-center"><Sparkles size={18} className="mr-2"/> Personal Imóvel</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-neutral-100">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'bot' && <div className="bg-primary-500 text-white rounded-full p-2"><Bot size={16}/></div>}
                    <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-neutral-200 text-neutral-800 rounded-br-none' : 'bg-white text-neutral-800 rounded-bl-none shadow-sm'}`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                     {msg.sender === 'user' && <div className="bg-neutral-200 text-neutral-600 rounded-full p-2"><User size={16}/></div>}
                  </div>
                ))}
                {isLoading && <div className="flex justify-start"><LoadingSpinner size={32} /></div>}
                <div ref={chatEndRef} />
              </div>
            </div>
            <div className="p-4 border-t border-neutral-200 bg-white">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Digite sua mensagem..."
                  className="w-full pr-12 pl-4 py-2 border border-neutral-200 rounded-full focus:ring-2 focus:ring-primary-500"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-700 disabled:bg-neutral-400"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
