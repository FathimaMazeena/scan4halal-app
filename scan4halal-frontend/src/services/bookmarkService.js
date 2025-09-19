export async function bookmarkIngredient(ingredientData) {
    const token = localStorage.getItem("token");
  
  const response = await fetch("http://localhost:5000/bookmark", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      ingredient: ingredientData
    })
  });

  if (!response.ok) {
    throw new Error("Bookmark failed");
  }

  return await response.json();
}

export async function getUserBookmarks() {
 const token = localStorage.getItem("token");
  
  const response = await fetch("http://localhost:5000/bookmarks", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch bookmarks");
  }

  return await response.json();
}

export async function removeBookmark(ingredientName) {
 const token = localStorage.getItem("token");
  
  const response = await fetch("http://localhost:5000/bookmark", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ ingredient_name: ingredientName })
  });

  if (!response.ok) {
    throw new Error("Failed to remove bookmark");
  }

  return await response.json();
}
