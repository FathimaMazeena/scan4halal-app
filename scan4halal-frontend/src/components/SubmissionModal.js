// components/SubmissionModal.jsx
import React, { useState } from 'react';
import { submitIngredient } from '../services/submissionService';

const SubmissionModal = ({ isOpen, onClose, ingredient }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage('');

    try {
      const result = await submitIngredient(ingredient);
      setMessage(result.message);
      
      // Close modal after 2 seconds on success
      if (result.success) {
        setTimeout(() => {
          onClose();
          setMessage('');
        }, 2000);
      }
    } catch (error) {
      setMessage(error.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Submit Ingredient for Review</h3>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">We'll submit this ingredient to our database team:</p>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <strong className="text-lg text-blue-800">{ingredient}</strong>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Our team will review and add it to the database if valid.
          </p>
        </div>

        {message && (
          <div className={`alert ${message.includes('submitted') ? 'alert-success' : 'alert-error'} mb-4`}>
            {message}
          </div>
        )}

        <div className="modal-action">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Submitting...
              </>
            ) : (
              'Confirm Submission'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;