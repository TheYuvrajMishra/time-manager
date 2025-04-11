"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const botMessage = { role: "bot", text: data.reply };
    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  };

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);
  
  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
  

  return (
    <main className="flex flex-col ml-[20vw] h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white font-sans">

      {/* Header */}
      <header className="text-center py-4 text-3xl font-bold bg-[#0f0f0f] border-b border-[#2c2c2c] shadow-md">
        💬 Manager
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-[90%] mx-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end gap-3 my-4 custom-scroll ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "bot" && (
                <div className="flex-shrink-0 bg-[#00FFAB] p-2 rounded-full shadow-lg text-black">
                  <Bot size={20} />
                </div>
              )}

              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed backdrop-blur-md ${
                  msg.role === "user"
                    ? "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-br-none shadow-md"
                    : "bg-[#2c2c2c] text-white rounded-bl-none shadow-inner"
                }`}
              >
                {msg.role === "bot" ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  <p>{msg.text}</p>
                )}
              </div>

              {msg.role === "user" && (
                <div className="flex-shrink-0 bg-blue-500 p-2 rounded-full shadow-lg text-white">
                  <User size={20} />
                </div>
              )}
            </div>
          ))}

          {/* Loading Dots */}
          {loading && (
            <div className="flex items-center gap-3 my-4">
              <div className="flex-shrink-0 bg-[#00FFAB] p-2 rounded-full text-black shadow-lg">
                <Bot size={20} />
              </div>
              <div className="bg-[#2c2c2c] px-4 py-2 rounded-xl text-sm flex gap-1 animate-pulse text-white">
                <span>Typing</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce [animation-delay:-0.2s]">.</span>
                <span className="animate-bounce [animation-delay:-0.4s]">.</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <footer className="px-6 py-4 border-t border-gray-800 bg-[#0f0f0f]/80 backdrop-blur-md">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <input
            type="text"
            className="flex-1 p-3 rounded-full bg-[#1a1a1a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Disturb Our AI . . ."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
        <button
  className="bg-gray-700 text-white py-2 px-3 rounded-full hover:bg-gray-600 transition"
  onClick={() => {
    const blob = new Blob([JSON.stringify(messages, null, 2)], {
      type: 'application/json'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'chat-log.json';
    link.click();
  }}
>
🡫
</button>
          <button
            onClick={sendMessage}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-full text-white font-semibold shadow-md"
          >
            ➤
          </button>
        </div>

      </footer>
    </main>
  );
}
