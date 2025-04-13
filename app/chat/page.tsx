'use client';
import GenerateImageButton from './components/GenerateImageButton';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaUserMd, FaRobot, FaInfoCircle } from 'react-icons/fa';
import { RiMentalHealthFill } from 'react-icons/ri';

export default function ChatBox() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setMessages([...messages, { user: userMessage, bot: '...' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: userMessage }),
      });
      const data = await res.json();

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].bot = data.answer;
        return updated;
      });
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { user: '', bot: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 to-purple-50 font-sans overflow-hidden">
      {/* Luxurious Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-2xl py-6 px-8 text-white"
      >
        <div className="max-w-6xl mx-auto flex items-center space-x-4">
          <RiMentalHealthFill className="text-3xl text-white" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              VitaMap Medical AI
            </h1>
            <p className="text-sm font-light opacity-90">
              Your premium health concierge
            </p>
          </div>
        </div>
      </motion.header>

      {/* Chat Container with Glass Morphism */}
      <div className="flex-1 overflow-y-auto p-6 relative">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center h-full"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'easeInOut',
                }}
                className="mb-8"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
                  <RiMentalHealthFill className="text-5xl text-white" />
                </div>
              </motion.div>

              <motion.h2 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome to VitaMap AI
              </motion.h2>

              <motion.p className="text-lg text-gray-600 mb-8 max-w-md text-center">
                Ask me anything about medications, supplements, or general
                wellness
              </motion.p>

              <motion.div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg max-w-md w-full border border-gray-100">
                <h3 className="font-medium text-gray-700 mb-3">Try asking:</h3>
                <div className="space-y-3">
                  {[
                    'What are the benefits of vitamin D?',
                    'Can I take ibuprofen with my current medication?',
                    'What are the symptoms of vitamin B12 deficiency?',
                  ].map((example, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 5 }}
                      onClick={() => {
                        setInput(example);
                      }}
                      className="text-left text-indigo-600 cursor-pointer hover:text-indigo-800 transition-colors px-4 py-3 bg-indigo-50 rounded-lg"
                    >
                      {example}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div className="space-y-6">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {msg.user && (
                    <div className="flex justify-end">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl rounded-br-none py-3 px-5 max-w-xl shadow-lg"
                      >
                        {msg.user}
                      </motion.div>
                    </div>
                  )}
                  {msg.bot && (
                    <div className="flex justify-start">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl rounded-bl-none py-3 px-5 max-w-xl shadow-lg relative"
                      >
                        {msg.bot === '...' ? (
                          <div className="flex space-x-2 items-center">
                            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                              <RiMentalHealthFill className="text-indigo-600 text-sm" />
                            </div>
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                              <div
                                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                style={{ animationDelay: '0.2s' }}
                              ></div>
                              <div
                                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                style={{ animationDelay: '0.4s' }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-indigo-100 rounded-full flex-shrink-0 flex items-center justify-center">
                                <RiMentalHealthFill className="text-indigo-600 text-sm" />
                              </div>
                              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {msg.bot}
                              </div>
                            </div>
                            <div className="flex justify-end mt-3">
                              <GenerateImageButton
                                text={msg.bot}
                                message={msg.bot}
                              />
                            </div>
                          </>
                        )}
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Premium Input Area */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="bg-white/95 backdrop-blur-lg border-t border-gray-200 px-6 py-5 shadow-xl"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="flex-grow border-0 bg-gray-100 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner text-gray-700 placeholder-gray-400 transition-all"
              placeholder="Type your health question..."
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <FaPaperPlane className="text-lg" />
              )}
            </motion.button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            VitaMap provides general health information only. Consult a
            healthcare professional for medical advice.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
