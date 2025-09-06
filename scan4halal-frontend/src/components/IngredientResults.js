// import React, { useState } from "react";
// import ChatBox from "./ChatBox";
// import { BookmarkIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

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
//     const response = await fetch("http://localhost:5000/rag/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ query }),
//     });
//     const data = await response.json();
//     setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
//   };

//   // function to map status → badge color
//   const getBadgeColor = (status) => {
//     switch (status.toLowerCase()) {
//       case "halal":
//         return "badge-success"; // green
//       case "haram":
//         return "badge-error"; // red
//       case "mushbooh":
//         return "badge-warning"; // yellow
//       default:
//         return "badge-ghost"; // gray
//     }
//   };

//   return (
//     <>
//       <div className="max-w-3xl mx-auto px-6 py-8">
//         <h2 className="text-2xl font-bold text-warning mb-4 tracking-wide">
//           Scan Results
//         </h2>
//         <ul className="bg-base-100 rounded-box shadow-md divide-y divide-base-200">
//           <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
//             This product contains:
//           </li>

//           {ingredientMatches.map((ing, idx) => {
//             const match = ing.matches[0];
//             return (
//               <li
//                 key={idx}
//                 className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6"
//               >
//                 {/* Avatar with badge */}
//                 <div className="avatar relative">
//                   <div className="size-14 rounded-box">
//                     <img
//                       alt={match.name}
//                       src="https://img.daisyui.com/images/profile/demo/batperson@192.webp"
//                     />
//                   </div>
//                   <span
//                     className={`absolute -top-2 -right-2 badge ${getBadgeColor(
//                       match.status
//                     )}`}
//                   >
//                     {match.status}
//                   </span>
//                 </div>

//                 {/* Ingredient Info */}
//                 <div className="flex-1">
//                   <div className="text-lg font-bold text-gray-800">
//                     {match.name}
//                   </div>
//                   <p className="text-xs text-gray-600 mt-1 leading-relaxed">
//                     {match.description || "No description available"}
//                   </p>
//                   <div className="mt-2 text-xs text-gray-500">
//                     <span className="font-semibold">Category:</span>{" "}
//                     {match.category || "N/A"} <br />
//                     <span className="font-semibold">Synonyms:</span>{" "}
//                     {match.synonyms?.length
//                       ? match.synonyms.join(", ")
//                       : "None"}
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => askAI(ing)}
//                     className="btn btn-square btn-ghost"
//                     title="Ask AI"
//                   >
//                     <ChatBubbleLeftRightIcon className="size-5" />
//                   </button>
//                   <button className="btn btn-square btn-ghost" title="Bookmark">
//                     <BookmarkIcon className="size-5" />
//                   </button>
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//       <div className="flex justify-center">
//         <button className="btn btn-soft btn-warning">Save Scan Results</button>
//       </div>
//       <ChatBox
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
import { askAIForIngredient, sendChatQuery, saveScan } from "../services/ingredientService";

function IngredientResults({ ingredientMatches, onSaveScan }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [productName, setProductName] = useState("");

  const handleAskAI = async (ingredient) => {
    const data = await askAIForIngredient(ingredient.matches[0].name);
    setChatOpen(true);
    setMessages([{ sender: "ai", text: data.explanation }]);
  };

  const handleSendMessage = async (query) => {
    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    const data = await sendChatQuery(query);
    setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
  };


const handleSaveScan = () => {
  if (!productName.trim()) {
    alert("Please enter a product name");
    return;
  }

  saveScan({
    productName,
    ingredientMatches,
    onSuccess: () => {
      setModalOpen(false);
      setProductName("");
    },
  });
};
  const getBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "halal": return "badge-success";
      case "haram": return "badge-error";
      case "mushbooh": return "badge-warning";
      default: return "badge-ghost";
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
                <div className="avatar relative">
                  <div className="size-14 rounded-box">
                    <img
                      alt={match.name}
                      src="https://img.daisyui.com/images/profile/demo/batperson@192.webp"
                    />
                  </div>
                  <span className={`absolute -top-2 -right-2 badge ${getBadgeColor(match.status)}`}>
                    {match.status}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="text-lg font-bold text-gray-800">{match.name}</div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {match.description || "No description available"}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="font-semibold">Category:</span> {match.category || "N/A"} <br />
                    <span className="font-semibold">Synonyms:</span> {match.synonyms?.length ? match.synonyms.join(", ") : "None"}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAskAI(ing)}
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

      <div className="flex justify-center mt-4">
        <button
          className="btn btn-soft btn-warning"
           onClick={() => setModalOpen(true)}
        >
          Save Scan Results
        </button>
      </div>

      {/* DaisyUI Modal */}
      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Save Scan</h3>
            <p className="py-2">Enter the product name for this scan:</p>
            <input
              type="text"
              placeholder="Product Name"
              className="input input-bordered w-full"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleSaveScan}>
                Save
              </button>
              <button className="btn" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ChatBox
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={messages}
        onSend={handleSendMessage}
      />
    </>
  );
}

export default IngredientResults;
