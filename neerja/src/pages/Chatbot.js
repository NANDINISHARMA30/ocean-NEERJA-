import React, { useState, useEffect, useRef } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newUserMessage = { role: "user", content: userInput };
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }), // ✅ must send { message }
      });

      const data = await res.json();

      const newBotMessage = {
        role: "assistant",
        content: data.reply || "⚠️ No response from server",
      };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error connecting to server." },
      ]);
    }

    setUserInput("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-center mb-4">🤖 Tunchik ChatBot</h1>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto mb-4 border p-3 rounded-lg h-96 bg-gray-50"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 p-2 rounded-lg max-w-[80%] ${
                msg.role === "user"
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-gray-300 text-black self-start mr-auto"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="text-gray-500 italic">Gemini is thinking...</div>
          )}
        </div>

        {/* Input */}
        <div className="flex">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 border rounded-l-lg p-2 outline-none text-black placeholder-gray-500 caret-blue-600"
            placeholder="Ask Gemini..."
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
