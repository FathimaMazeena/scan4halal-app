// ingredientService.js
export const askAIForIngredient = async (ingredientName) => {
  const response = await fetch("http://localhost:5000/rag/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredient: ingredientName }),
  });
  const data = await response.json();
  return data.explanation;
};

export const sendChatQuery = async (query) => {
  const response = await fetch("http://localhost:5000/rag/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const data = await response.json();
  return data.reply;
};

// Save scan API call
export const saveScan = async ({ productName, ingredientMatches, onSuccess }) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/scans/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_name: productName,
        ingredients: ingredientMatches,
      }),
    });

    if (!res.ok) throw new Error("Failed to save scan");

    const data = await res.json();
    alert(`Scan saved successfully! ID: ${data.scan_id}`);

    // Call a callback to update component state (like closing modal)
    if (onSuccess) onSuccess();

  } catch (err) {
    console.error(err);
    alert("Error saving scan");
  }
};

