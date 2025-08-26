import React, { useState } from "react";

function ChatBox({ isOpen, onClose, messages, onSend }) {
  const [input, setInput] = useState("");

  if (!isOpen) return null;
  

  return (
    <div className="fixed bottom-4 right-4 w-80 max-h-[70vh] bg-base-100 shadow-xl rounded-xl flex flex-col">
      {/* Header */}
      <div className="p-3 bg-warning text-white font-semibold flex justify-between items-center rounded-t-xl">
        Chat with AI
        <button onClick={onClose} className="btn btn-xs btn-ghost text-white">✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat ${msg.sender === "user" ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-bubble">{msg.text}</div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input input-sm input-bordered flex-1"
          placeholder="Type a message..."
        />
        <button
          onClick={() => {
            if (input.trim()) {
              onSend(input);
              setInput("");
            }
          }}
          className="btn btn-sm btn-warning"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
