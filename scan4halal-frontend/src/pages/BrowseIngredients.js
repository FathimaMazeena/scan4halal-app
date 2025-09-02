import React, { useEffect, useState } from "react";
import IngredientCard from "../components/IngredientCard";

function BrowseIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setLoading(true);
        console.log("Fetching ingredients..."); // Debug log
        
        const response = await fetch("http://localhost:5000/browse/ingredients");
        console.log("Response status:", response.status); // Debug log
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched data:", data); // Debug log
        
        setIngredients(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching ingredients:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="loading loading-spinner loading-lg"></div>
        <p>Loading ingredients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="alert alert-error">
          <span>Error loading ingredients: {error}</span>
        </div>
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>No ingredients found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Browse Ingredients</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ingredients.map((ing, idx) => (
          <IngredientCard
            key={ing.id || idx} // Use ingredient ID if available
            name={ing.name}
            description={ing.description}
            category={ing.category}
            onClick={() => console.log("Clicked", ing.name)}
          />
        ))}
      </div>
    </div>
  );
}

export default BrowseIngredients;