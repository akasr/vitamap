// app/chat/page.tsx
'use client';
import GenerateImageButton from './components/GenerateImageButton';
import { useState, useRef, useEffect } from "react";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input;
    setMessages([...messages, { user: userMessage, bot: "..." }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: userMessage }),
      });
      const data = await res.json();
      
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].bot = data.answer;
        return updated;
      });
    } catch (error) {
      setMessages(prev => [...prev, { user: "", bot: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <h1 className="text-xl font-bold text-blue-600">VitaMap Medical Chat</h1>
        <p className="text-sm text-gray-500">Ask your health-related questions</p>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="text-center p-6 max-w-md">
              <h2 className="text-xl font-medium mb-2">Welcome to VitaMap Chat</h2>
              <p>Ask me about vitamins, medications, or general health advice.</p>
              <p className="mt-4 text-sm">Example: "What are the benefits of vitamin D?"</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="space-y-2">
              {msg.user && (
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-lg py-2 px-4 max-w-xs md:max-w-md lg:max-w-lg">
                    {msg.user}
                  </div>
                </div>
              )}
              {msg.bot && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg py-2 px-4 max-w-xs md:max-w-md lg:max-w-lg">
                    {msg.bot === "..." ? (
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    ) : (
                      <>
                        {msg.bot}
                        {/* Add the image generation button here */}
                        <div className="flex justify-end mt-1">
                          <GenerateImageButton text={msg.bot} message={msg.bot} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your health question..."
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-blue-600 text-white rounded-full p-2 w-12 h-12 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          VitaMap provides general health information only. Consult a doctor for medical advice.
        </p>
      </div>
    </div>
  );
}