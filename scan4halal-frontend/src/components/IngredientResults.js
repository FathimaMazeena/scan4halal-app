// import React, { useState } from "react";
// import ChatBox from "./ChatBox";

// function IngredientResults({ ingredientMatches }) {

//   const [chatOpen, setChatOpen] = useState(false);
//   const [messages, setMessages] = useState([]);

//   const askAI = async (ing) => {

//     const response = await fetch("http://localhost:5000/rag/explain", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ingredient: ing.matches[0].name }),
//     });
//     const data = await response.json();

//     setChatOpen(true);
//     setMessages([{ sender: "ai", text: data.explanation }]);
//   };

//   const handleSend = async (query) => {
//     setMessages((prev) => [...prev, { sender: "user", text: query }]);

//     // Call backend for chat reply
//     const response = await fetch("http://localhost:5000/rag/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ query }),
//     });
//     const data = await response.json();

//     setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
//   };

//   return (
//     <>
//       <div className="max-w-3xl mx-auto px-6 py-8">
//         <h2 class="text-2xl font-bold text-warning mb-4 tracking-wide">
//           Scan Results
//         </h2>
//         <ul className="bg-base-100 rounded-box shadow-md divide-y divide-base-200">
//           <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
//             This product contains:
//           </li>

//           {ingredientMatches.map((ing, idx) => (
//             <li className="list-row flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6">
//               {/* <div>
//               <img
//                 className="size-10 rounded-box"
//                 src="https://img.daisyui.com/images/profile/demo/1@94.webp"
//               />
//             </div> */}

//               <div className="avatar indicator">
//                 <span className="indicator-item badge badge-accent">
//                   {ing.matches[0].status}
//                 </span>
//                 <div className="size-12 rounded-box">
//                   <img
//                     alt="Tailwind CSS examples"
//                     src="https://img.daisyui.com/images/profile/demo/batperson@192.webp"
//                   />
//                 </div>
//               </div>

              
//                <div className="flex-1">
//           <div className="text-lg font-bold text-gray-800">{ing.matches[0].name}</div>
//           <p className="text-xs text-gray-600 mt-1 leading-relaxed">
//             {ing.matches[0].description}
//           </p>
//         </div>
//               <button onClick={() => askAI(ing)} className="btn btn-square btn-ghost">
//                 Ask AI
//               </button>
//               <button className="btn btn-square btn-ghost">
//                 <svg
//                   className="size-[1.2em]"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                 >
//                   <g
//                     strokeLinejoin="round"
//                     strokeLinecap="round"
//                     strokeWidth="2"
//                     fill="none"
//                     stroke="currentColor"
//                   >
//                     <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
//                   </g>
//                 </svg>
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="flex justify-center">
//         <button className="btn btn-soft btn-warning ">Save Scan Results</button>
//       </div>
//        <ChatBox
//         isOpen={chatOpen}
//         onClose={() => setChatOpen(false)}
//         messages={messages}
//         onSend={handleSend}
//       />
//     </>
//   );
// }

// export default IngredientResults;


import React, { useState } from "react";
import ChatBox from "./ChatBox";
import { BookmarkIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

function IngredientResults({ ingredientMatches }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const askAI = async (ing) => {
    const response = await fetch("http://localhost:5000/rag/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredient: ing.matches[0].name }),
    });
    const data = await response.json();

    setChatOpen(true);
    setMessages([{ sender: "ai", text: data.explanation }]);
  };

  const handleSend = async (query) => {
    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    const response = await fetch("http://localhost:5000/rag/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
  };

  // function to map status → badge color
  const getBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "halal":
        return "badge-success"; // green
      case "haram":
        return "badge-error"; // red
      case "mushbooh":
        return "badge-warning"; // yellow
      default:
        return "badge-ghost"; // gray
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-warning mb-4 tracking-wide">
          Scan Results
        </h2>
        <ul className="bg-base-100 rounded-box shadow-md divide-y divide-base-200">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
            This product contains:
          </li>

          {ingredientMatches.map((ing, idx) => {
            const match = ing.matches[0];
            return (
              <li
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6"
              >
                {/* Avatar with badge */}
                <div className="avatar relative">
                  <div className="size-14 rounded-box">
                    <img
                      alt={match.name}
                      src="https://img.daisyui.com/images/profile/demo/batperson@192.webp"
                    />
                  </div>
                  <span
                    className={`absolute -top-2 -right-2 badge ${getBadgeColor(
                      match.status
                    )}`}
                  >
                    {match.status}
                  </span>
                </div>

                {/* Ingredient Info */}
                <div className="flex-1">
                  <div className="text-lg font-bold text-gray-800">
                    {match.name}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {match.description || "No description available"}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="font-semibold">Category:</span>{" "}
                    {match.category || "N/A"} <br />
                    <span className="font-semibold">Synonyms:</span>{" "}
                    {match.synonyms?.length
                      ? match.synonyms.join(", ")
                      : "None"}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => askAI(ing)}
                    className="btn btn-square btn-ghost"
                    title="Ask AI"
                  >
                    <ChatBubbleLeftRightIcon className="size-5" />
                  </button>
                  <button className="btn btn-square btn-ghost" title="Bookmark">
                    <BookmarkIcon className="size-5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex justify-center">
        <button className="btn btn-soft btn-warning">Save Scan Results</button>
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