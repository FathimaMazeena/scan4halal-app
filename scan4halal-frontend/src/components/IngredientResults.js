import React, { useState } from "react";
import ChatBox from "./ChatBox";

function IngredientResults({ ingredients }) {

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const askAI = async (ingredient) => {

    const response = await fetch("http://localhost:5000/rag/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredient }),
    });
    const data = await response.json();

    setChatOpen(true);
    setMessages([{ sender: "ai", text: data.explanation }]);
  };

  const handleSend = async (query) => {
    setMessages((prev) => [...prev, { sender: "user", text: query }]);

    // Call backend for chat reply
    const response = await fetch("http://localhost:5000/rag/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();

    setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
  };

  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h2 class="text-2xl font-bold text-warning mb-4 tracking-wide">
          Scan Results
        </h2>
        <ul className="bg-base-100 rounded-box shadow-md divide-y divide-base-200">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
            This product contains:
          </li>

          {ingredients.map((ing, idx) => (
            <li className="list-row flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6">
              {/* <div>
              <img
                className="size-10 rounded-box"
                src="https://img.daisyui.com/images/profile/demo/1@94.webp"
              />
            </div> */}

              <div className="avatar indicator">
                <span className="indicator-item badge badge-accent">
                  Halal
                </span>
                <div className="size-12 rounded-box">
                  <img
                    alt="Tailwind CSS examples"
                    src="https://img.daisyui.com/images/profile/demo/batperson@192.webp"
                  />
                </div>
              </div>

              <div>E130</div>
              
               <div className="flex-1">
          <div className="text-lg font-bold text-gray-800">{ing}</div>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            "Remaining Reason" became an instant hit, praised for its haunting
            sound and emotional depth. A viral performance brought it widespread
            recognition, making it one of Dio Lupa’s most iconic tracks.
          </p>
        </div>
              <button onClick={() => askAI(ing)} className="btn btn-square btn-ghost">
                Ask AI
              </button>
              <button className="btn btn-square btn-ghost">
                <svg
                  className="size-[1.2em]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </g>
                </svg>
              </button>
            </li>
          ))}

          {/* <li className="list-row">
            <div>
              <img
                className="size-10 rounded-box"
                src="https://img.daisyui.com/images/profile/demo/4@94.webp"
              />
            </div>
            <div>
              <div>E220</div>
              <div className="text-xs uppercase font-semibold opacity-60">
                Bears of a fever
              </div>
            </div>
            <p className="list-col-wrap text-xs">
              "Bears of a Fever" captivated audiences with its intense energy
              and mysterious lyrics. Its popularity skyrocketed after fans
              shared it widely online, earning Ellie critical acclaim.
            </p>
            <button className="btn btn-square btn-ghost">
              <svg
                className="size-[1.2em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M6 3L20 12 6 21 6 3z"></path>
                </g>
              </svg>
            </button>
            <button className="btn btn-square btn-ghost">
              <svg
                className="size-[1.2em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </g>
              </svg>
            </button>
          </li>

          <li className="list-row">
            <div className="avatar indicator">
              <span className="indicator-item badge badge-secondary">
                Halal
              </span>
              <div className="h-20 w-20 rounded-lg">
                <img
                  alt="Tailwind CSS examples"
                  src="https://img.daisyui.com/images/profile/demo/batperson@192.webp"
                />
              </div>
            </div>
            <div>
              <div>E120</div>
              <div className="text-xs uppercase font-semibold opacity-60">
                Cappuccino
              </div>
            </div>
            <p className="list-col-wrap text-xs">
              "Cappuccino" quickly gained attention for its smooth melody and
              relatable themes. The song’s success propelled Sabrino into the
              spotlight, solidifying their status as a rising star.
            </p>
            <button className="btn btn-square btn-ghost">
              <svg
                className="size-[1.2em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M6 3L20 12 6 21 6 3z"></path>
                </g>
              </svg>
            </button>
            <button className="btn btn-square btn-ghost">
              <svg
                className="size-[1.2em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </g>
              </svg>
            </button>
          </li> */}
        </ul>
      </div>
      <div className="flex justify-center">
        <button className="btn btn-soft btn-warning ">Save Scan Results</button>
      </div>
       <ChatBox
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={messages}
        onSend={handleSend}
      />
    </>
  );
}

export default IngredientResults;
