// components/BookmarksPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { 
  BookmarkIcon, 
  BookmarkSlashIcon, 
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { getUserBookmarks, removeBookmark} from '../services/bookmarkService';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      loadBookmarks();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterBookmarks();
  }, [bookmarks, searchTerm, statusFilter]);

  const loadBookmarks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/bookmarks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookmarks(data.bookmarks || []);
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
      alert('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const filterBookmarks = () => {
    let filtered = bookmarks;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(bookmark =>
        bookmark.ingredient.ingredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.ingredient.best_match?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(bookmark =>
        bookmark.ingredient.status === statusFilter
      );
    }

    setFilteredBookmarks(filtered);
  };

  const handleRemoveBookmark = async (ingredientName) => {
    if (!window.confirm('Are you sure you want to remove this bookmark?')) {
      return;
    }

    try {
      await removeBookmark(ingredientName);
      setBookmarks(bookmarks.filter(b => b.ingredient.ingredient !== ingredientName));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      alert('Failed to remove bookmark');
    }
  };


  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'halal': return 'badge-success';
      case 'haram': return 'badge-error';
      case 'mushbooh': return 'badge-warning';
      case 'doubtful': return 'badge-warning';
      default: return 'badge-ghost';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="alert alert-warning">
          <span>Please log in to view your bookmarks</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-4">Loading your bookmarks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Your Bookmarked Ingredients</h1>
        <p className="text-gray-600">Manage and review your saved ingredients</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-base-200 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookmarks..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="select select-bordered"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="halal">Halal</option>
            <option value="haram">Haram</option>
            <option value="mushbooh">Mushbooh</option>
            <option value="doubtful">Doubtful</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="stats shadow mb-6">
        <div className="stat">
          <div className="stat-title">Total Bookmarks</div>
          <div className="stat-value">{bookmarks.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Filtered</div>
          <div className="stat-value">{filteredBookmarks.length}</div>
        </div>
      </div>

      {/* Bookmarks Grid */}
      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-12">
          <BookmarkIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {bookmarks.length === 0 ? 'No bookmarks yet' : 'No matching bookmarks'}
          </h3>
          <p className="text-gray-500">
            {bookmarks.length === 0
              ? 'Start bookmarking ingredients from your scan results!'
              : 'Try adjusting your search or filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookmarks.map((bookmark, index) => (
            <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <h2 className="card-title text-lg">
                    {bookmark.ingredient.ingredient}
                  </h2>
                  <span className={`badge ${getStatusColor(bookmark.ingredient.status)}`}>
                    {bookmark.ingredient.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>

                {/* Ingredient Details */}
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Matched to:</strong> {bookmark.ingredient.best_match || 'No match'}
                  </p>
                  <p className="text-sm">
                    <strong>Confidence:</strong> {bookmark.ingredient.score ? `${bookmark.ingredient.score}%` : 'N/A'}
                  </p>
                  {bookmark.ingredient.category && (
                    <p className="text-sm">
                      <strong>Category:</strong> {bookmark.ingredient.category}
                    </p>
                  )}
                </div>


                {/* Actions */}
                <div className="card-actions justify-end mt-4">
                  <button
                    onClick={() => handleRemoveBookmark(bookmark.ingredient.ingredient)}
                    className="btn btn-sm btn-error"
                    title="Remove bookmark"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Remove
                  </button>
                </div>

                {/* Metadata */}
                <div className="text-xs text-gray-500 mt-3">
                  Saved on {new Date(bookmark.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;