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


import React, { useEffect, useState } from "react";

function SavedScans({ onSelectScan }) {
  const [scans, setScans] = useState([]);

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
              onClick={() => onSelectScan(scan)}
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
      <div className="w-1/2 h-screen p-6">
        {/* onSelectScan sets this panel with scan details */}
      </div>
    </div>
  );
}

export default SavedScans;
