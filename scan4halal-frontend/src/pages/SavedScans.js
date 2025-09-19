// import React, { useEffect, useState } from "react";
// import IngredientResults from "../components/IngredientResults"; // your existing component

// function SavedScans() {
//   const [scans, setScans] = useState([]);
//   const [selectedScan, setSelectedScan] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Fetch saved scans from backend
//   useEffect(() => {
//     const fetchScans = async () => {
//       const token = localStorage.getItem("token");
//       const res = await fetch("http://localhost:5000/scans", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setScans(data);
//     };

//     fetchScans();
//   }, []);

//   const handleScanClick = (scan) => {
//     setSelectedScan(scan);
//     setSidebarOpen(true);
//   };

//   return (
//     <div className="flex">
//       {/* Scan List */}
//       <ul className="list bg-base-100 rounded-box shadow-md w-80 p-4">
//         <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
//           Saved Scans
//         </li>

//         {scans.map((scan) => (
//           <li
//             key={scan._id}
//             className="list-row cursor-pointer hover:bg-gray-100 p-2 rounded"
//             onClick={() => handleScanClick(scan)}
//           >
//             <div className="flex justify-between">
//               <span>{scan.product_name}</span>
//               <span className="text-xs opacity-60">
//                 {new Date(scan.scanned_at).toLocaleString()}
//               </span>
//             </div>
//           </li>
//         ))}
//       </ul>

//       {/* Sidebar */}
//       {sidebarOpen && selectedScan && (
//         <div className="drawer drawer-end">
//           <input
//             id="scan-sidebar"
//             type="checkbox"
//             className="drawer-toggle"
//             checked={sidebarOpen}
//             readOnly
//           />
//           <div className="drawer-content">
//             {/* empty drawer content */}
//           </div>
//           <div className="drawer-side">
//             <label
//               htmlFor="scan-sidebar"
//               className="drawer-overlay"
//               onClick={() => setSidebarOpen(false)}
//             ></label>
//             <div className="w-96 bg-base-100 p-4">
//               <h2 className="text-xl font-bold mb-4">
//                 {selectedScan.product_name}
//               </h2>
//               <IngredientResults ingredientMatches={selectedScan.ingredients} />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SavedScans;



import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import IngredientResults from "../components/IngredientResults";
import {
  DocumentTextIcon,
  CalendarIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";

function SavedScans({ onSelectScan }) {
  const [scans, setScans] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
   const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);


  useEffect(() => {
    const fetchScans = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/scans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setScans(data); // your backend returns array directly
    };

    fetchScans();
  }, []);


  const fetchScanDetails = async (scanId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/scans/${scanId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Failed to fetch scan details");
      
      const data = await res.json();
      setSelectedScan(data);
    } catch (error) {
      console.error("Error fetching scan details:", error);
      alert("Failed to load scan details");
    }
  };

  const handleSelectScan = (scan) => {
    fetchScanDetails(scan._id);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex">
      {/* Left panel: saved scans */}
      <div className="w-1/2 h-screen overflow-y-auto p-6 bg-gray-50 border-r border-gray-200 shadow-lg">
        <h2 className="text-3xl font-extrabold text-yellow-600 mb-6 tracking-wider">
          Saved Scans
        </h2>

        <ul className="space-y-4">
          {scans.map((scan) => (
            <li
              key={scan._id}
              className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transform duration-200"
              onClick={() => handleSelectScan(scan)}
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">
                  {scan.product_name}
                </span>
                <span className="text-xs text-gray-400 italic">
                  {new Date(scan.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Click to view ingredient details & AI insights
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Right panel can be used for ingredient results */}
       <div className="w-2/3 h-screen overflow-y-auto p-6">
        {selectedScan ? (
          <div>
            <button
              onClick={() => setSelectedScan(null)}
              className="btn btn-ghost btn-sm mb-4"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to list
            </button>
            
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {selectedScan.product_name}
              </h1>
              <p className="text-gray-500 flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Scanned on {formatDate(selectedScan.scanned_at)}
              </p>
            </div>

            {/* Reuse the IngredientResults component */}
            <IngredientResults
              ingredientMatches={selectedScan.ingredients || []}
              showSaveButton={false}
              showHeader={false}
              readOnly={true}
              productName={selectedScan.product_name}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">Select a scan to view details</h3>
              <p>Choose a saved scan from the list to see the full analysis</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default SavedScans;


