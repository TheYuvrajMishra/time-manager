"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const clearChat = () => {
    if (confirm("Clear chat history?")) {
      setMessages([]);
      localStorage.removeItem("chatHistory");
      alert("Chat cleared!");
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const { reply } = await res.json();
    setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    setLoading(false);
  };

  useEffect(() => {
    if (messages.length) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <main className="flex flex-col ml-[20%] h-screen bg-[#202020] text-white">
      {/* Header */}
      <header className="px-6 py-4 bg-[#101010] border-b border-[#303030]">
        <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-white">
          💬 Manager
        </h1>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-[95%] mx-auto flex flex-col space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "bot" && (
                <div className="p-2 mr-2 rounded-full bg-cyan-400 drop-shadow-[0_0_6px_rgba(0,255,255,0.5)]">
                  <Bot size={20} className="text-black" />
                </div>
              )}

              <div
                className={`px-4 py-2 max-w-[70%] text-sm leading-relaxed backdrop-blur-sm rounded-2xl transition ${
                  msg.role === "user"
                    ? "bg-[#232323] border-white/20 border border-dashed  mr-2 rounded-br-none drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                    : "bg-[#101010]  border-white/20 border border-dashed bg-opacity-20 rounded-bl-none drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                }`}
              >
                {msg.role === "bot" ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  <p>{msg.text}</p>
                )}
              </div>

              {msg.role === "user" && (
                <div className="p-2 rounded-full bg-purple-500 drop-shadow-[0_0_6px_rgba(128,0,255,0.5)]">
                  <User size={20} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-cyan-400 drop-shadow-[0_0_6px_rgba(255,255,255,0.1)]">
                <Bot size={20} className="text-black" />
              </div>
              <div className="flex items-center gap-1 px-4 py-2 text-sm bg-[#101010] bg-opacity-80 rounded-xl animate-pulse drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]">
                <span>Typing</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-200">.</span>
                <span className="animate-bounce delay-300">.</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <footer className="px-6 py-4 bg-[#101010] border-t border-[#303030] flex items-center space-x-4">
        <button
          onClick={clearChat}
          className="text-gray-400 hover:text-red-500 transition"
          title="Clear Chat"
        >
          🗑️
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message…"
          className="flex-1 px-4 py-3 bg-[#202020] bg-opacity-80 placeholder-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />

        <button
          onClick={sendMessage}
          className="px-5 py-3  bg-black/80 rounded-full font-semibold drop-shadow-[0_0_8px_rgba(0,255,255,0.6)] hover:black transition-all"
        >
          ➤
        </button>
      </footer>
    </main>
  );
}
