// src/components/dashboard/PartsInventory.jsx
import React, { useState, useEffect } from 'react';
import SparePartsService from '../services/SparePartsService';

const PartsInventory = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [newPart, setNewPart] = useState({
    name: '',
    brand: '',
    price: '',
    stock_quantity: '',
    location_id: ''
  });

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const fetchSpareParts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await SparePartsService.getAllSpareParts();
      
      console.log('API Response:', response);
      
      const parts = response.data;
      if (!Array.isArray(parts)) {
        throw new Error('Invalid response format - expected array');
      }
      
      const formattedParts = parts.map(part => ({
        id: part.id,
        name: part.name || 'Unnamed Part',
        brand: part.brand || 'Unknown Brand',
        price: part.price,
        formattedPrice: `$${part.price.toLocaleString()}`,
        stock_quantity: typeof part.stock_quantity === 'number' ? part.stock_quantity : 0,
        location_id: part.location_id || null
      }));
      
      setSpareParts(formattedParts);
    } catch (err) {
      console.error('Error fetching spare parts:', err);
      setError(`Error loading spare parts: ${err.message || 'Unknown error'}. ${err.response?.data?.message || ''}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPart(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    
    try {
      const partData = {
        name: newPart.name.trim(),
        brand: newPart.brand.trim(),
        price: parseFloat(newPart.price) || 0,
        stock_quantity: parseInt(newPart.stock_quantity) || 0,
        location_id: parseInt(newPart.location_id) || 1 // Default to location 1 if not provided
      };
      
      await SparePartsService.addSparePart(partData);
      setNewPart({
        name: '',
        brand: '',
        price: '',
        stock_quantity: '',
        location_id: ''
      });
      setFormVisible(false);
      fetchSpareParts();
    } catch (err) {
      console.error('Error adding spare part:', err);
      setError(`Failed to add new part: ${err.message || 'Unknown error'}. ${err.response?.data?.message || ''}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      setError(null); // Clear previous errors
      
      try {
        await SparePartsService.deleteSparePart(id);
        fetchSpareParts();
      } catch (err) {
        console.error('Error deleting spare part:', err);
        setError(`Failed to delete part: ${err.message || 'Unknown error'}. ${err.response?.data?.message || ''}`);
      }
    }
  };

  const handleUpdateStock = async (id, currentStock, amount) => {
    const newStock = currentStock + amount;
    if (newStock < 0) return; // Prevent negative stock
    
    setError(null); // Clear previous errors
    
    try {
      await SparePartsService.updateSparePart(id, { stock_quantity: newStock });
      // Update local state without refetching
      setSpareParts(prevParts => 
        prevParts.map(part => 
          part.id === id 
            ? {...part, stock_quantity: newStock} 
            : part
        )
      );
    } catch (err) {
      console.error('Error updating stock:', err);
      setError(`Failed to update stock quantity: ${err.message || 'Unknown error'}. ${err.response?.data?.message || ''}`);
      // Revert to original data
      fetchSpareParts();
    }
  };

  // Show debug info if there's an error
  if (error) {
    return (
      <div className="error-section">
        <h3>Error Loading Parts</h3>
        <p className="error-message">{error}</p>
        <button 
          className="retry-btn"
          onClick={fetchSpareParts}
        >
          Retry
        </button>
        <details>
          <summary>Debug Info</summary>
          <pre>API Endpoints: 
  - GET /spare-parts (requires authentication)
  - GET /spare-parts/:id (requires authentication)
  - POST /spare-parts (requires authentication)
  - PUT /spare-parts/:id (requires authentication)
  - DELETE /spare-parts/:id (requires authentication)</pre>
        </details>
      </div>
    );
  }

  if (loading) {
    return <div className="section-loading">Loading inventory...</div>;
  }

  return (
    <section className="parts-inventory section">
      <div className="section-header">
        <h2>Spare Parts Inventory</h2>
        <button 
          className="add-btn"
          onClick={() => setFormVisible(!formVisible)}
        >
          {formVisible ? 'Cancel' : 'Add New Part'}
        </button>
      </div>
      
      {formVisible && (
        <form onSubmit={handleSubmit} className="parts-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Part Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={newPart.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input 
                type="text" 
                id="brand" 
                name="brand" 
                value={newPart.brand} 
                onChange={handleInputChange} 
                required 
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (₹)</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                value={newPart.price} 
                onChange={handleInputChange} 
                step="0.01" 
                min="0"
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="stock_quantity">Stock Quantity</label>
              <input 
                type="number" 
                id="stock_quantity" 
                name="stock_quantity" 
                value={newPart.stock_quantity} 
                onChange={handleInputChange}
                min="0" 
                required 
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location_id">Location ID</label>
              <input 
                type="number" 
                id="location_id" 
                name="location_id" 
                value={newPart.location_id} 
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
          </div>
          <div className="form-buttons">
            <button type="submit" className="submit-btn">Add Part</button>
          </div>
        </form>
      )}
      
      <div className="parts-grid">
        {spareParts.length > 0 ? (
          spareParts.map(part => (
            <div className="part-card" key={part.id}>
              <div className="part-info">
                <h3>{part.name}</h3>
                <p className="part-brand">{part.brand}</p>
                <p className="part-price">{part.formattedPrice}</p>
                <p className={`part-stock ${part.stock_quantity < 10 ? 'low-stock' : ''}`}>
                  Stock: {part.stock_quantity} {part.stock_quantity < 10 && '(Low)'}
                </p>
                {part.location_id && (
                  <p className="part-location">Location: {part.location_id}</p>
                )}
                <div className="part-actions">
                  <button 
                    className="stock-btn decrease" 
                    onClick={() => handleUpdateStock(part.id, part.stock_quantity, -1)}
                    disabled={part.stock_quantity <= 0}
                  >
                    -
                  </button>
                  <button 
                    className="stock-btn increase" 
                    onClick={() => handleUpdateStock(part.id, part.stock_quantity, 1)}
                  >
                    +
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(part.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No spare parts in inventory.</p>
            <button 
              className="primary-btn"
              onClick={() => setFormVisible(true)}
            >
              Add Your First Part
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PartsInventory;