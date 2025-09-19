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

// IngredientResults.jsx
import React, { useState, useEffect, useContext } from "react";
import SubmissionModal from "./SubmissionModal";
import ChatBox from "./ChatBox";
import {
  BookmarkIcon,
  BookmarkSlashIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { saveScan } from "../services/ingredientService";
import { AuthContext } from "../contexts/AuthContext";
import {
  bookmarkIngredient,
  removeBookmark,
} from "../services/bookmarkService";

const IngredientResults = ({ ingredientMatches }) => {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [productName, setProductName] = useState("");

  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const { user, isAuthenticated } = useContext(AuthContext);

  const askAI = async (match) => {
    const response = await fetch("http://localhost:5000/rag/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ingredient: match.ingredient,
        context: match,
      }),
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

  const handleOpenModal = (ingredient) => {
    setSelectedIngredient(ingredient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIngredient(null);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadUserBookmarks();
    }
  }, [isAuthenticated]);

  const loadUserBookmarks = async () => {
    try {
      const response = await fetch("http://localhost:5000/bookmarks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const bookmarkedNames = data.bookmarks.map(
          (b) => b.ingredient.ingredient
        );
        setBookmarkedItems(new Set(bookmarkedNames));
      }
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
    }
  };

  const handleBookmark = async (ingredient) => {
    if (!isAuthenticated) {
      alert("Please login to bookmark ingredients");
      return;
    }

    try {
      if (bookmarkedItems.has(ingredient.ingredient)) {
        // Remove bookmark
        await removeBookmark(ingredient.ingredient);
        setBookmarkedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(ingredient.ingredient);
          return newSet;
        });
      } else {
        // Add bookmark
        await bookmarkIngredient(ingredient);
        setBookmarkedItems((prev) => new Set(prev).add(ingredient.ingredient));
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      alert(error.message || "Failed to bookmark ingredient");
    }
  };

  // Check if ingredientMatches is valid and has items
  if (!ingredientMatches || ingredientMatches.length === 0) {
    return (
      <div className="max-w-4xl mx-auto my-8 p-6 bg-base-100 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-center text-gray-700">
          No ingredient matches found
        </h3>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-base-100 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-center text-primary">
        Ingredient Analysis Results
      </h3>

      {/* Summary Statistics */}
      <div className="mt-6 p-4 bg-base-200 rounded-lg">
        <h4 className="font-bold mb-2">Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">
              {ingredientMatches.filter((m) => m.status === "halal").length}
            </p>
            <p className="text-sm">Halal</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">
              {ingredientMatches.filter((m) => m.status === "haram").length}
            </p>
            <p className="text-sm">Haram</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">
              {
                ingredientMatches.filter(
                  (m) => m.status === "mushbooh" || m.status === "doubtful"
                ).length
              }
            </p>
            <p className="text-sm">Doubtful</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {ingredientMatches.map((match, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            {/* Display the original OCR ingredient */}
            <h4 className="font-semibold text-lg mb-2">
              {match.ingredient || "Unknown Ingredient"}
            </h4>

            {/* Display match information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  <strong>Matched to:</strong>{" "}
                  {match.best_match || "No match found"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Match Method:</strong> {match.match_method || "None"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Confidence:</strong>{" "}
                  {match.score ? `${match.score.toFixed(1)}%` : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-bold ${
                      match.status === "halal"
                        ? "text-green-600"
                        : match.status === "haram"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {match.status?.toUpperCase() || "UNKNOWN"}
                  </span>
                </p>
                {match.category && (
                  <p className="text-sm text-gray-600">
                    <strong>Category:</strong> {match.category}
                  </p>
                )}
                {match.available_in_db && (
                  <p className="text-sm text-green-600">
                    ✓ Available in database
                  </p>
                )}
              </div>
            </div>

            {/* Display description if available */}
            {match.description && (
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Description:</strong> {match.description}
                </p>
              </div>
            )}

            {/* Display synonyms if available */}
            {match.synonyms && match.synonyms.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  <strong>Also known as:</strong> {match.synonyms.join(", ")}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => askAI(match)}
                className="btn btn-square btn-ghost"
                title="Ask AI"
              >
                <ChatBubbleLeftRightIcon className="size-5" />
              </button>
              <button
                onClick={() => handleBookmark(match)}
                className="btn btn-square btn-ghost"
                title={
                  bookmarkedItems.has(match.ingredient)
                    ? "Remove bookmark"
                    : "Bookmark this ingredient"
                }
              >
                {bookmarkedItems.has(match.ingredient) ? (
                  <BookmarkSlashIcon className="size-5 text-yellow-500 fill-yellow-500" />
                ) : (
                  <BookmarkIcon className="size-5" />
                )}
              </button>
            </div>

            {/* Submit button for non-existing ingredients */}
            {!match.available_in_db && (
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => handleOpenModal(match.ingredient)}
                  className="btn btn-sm btn-outline btn-primary whitespace-nowrap"
                  title="Submit this ingredient for database review"
                >
                  📩 Request Addition
                </button>
              </div>
            )}
          </div>
        ))}

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
      </div>

      <SubmissionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        ingredient={selectedIngredient}
      />

      <ChatBox
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={messages}
        onSend={handleSend}
      />
    </div>
  );
};

export default IngredientResults;
