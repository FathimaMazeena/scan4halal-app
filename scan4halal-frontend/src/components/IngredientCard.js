import React, { useState } from "react";

function IngredientCard({ name, description, category, onClick }) {
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="badge badge-outline">{category}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={onClick}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

export default IngredientCard;
