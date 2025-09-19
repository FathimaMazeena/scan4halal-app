// services/submissionService.js
export async function submitIngredient(ingredientName) {
  const response = await fetch("http://localhost:5000/ingredients/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ingredient_name: ingredientName
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || "Submission failed");
  }

  return data;
}