import React, { useState, useEffect } from 'react';
import CarService from '../services/CarService';

const FeaturedVehicles = ({ setActiveSection, user, setSelectedCar, isManageMode = false }) => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddCarForm, setShowAddCarForm] = useState(false);
  const [newCar, setNewCar] = useState({
    model: '',
    brand: '',
    year: new Date().getFullYear(),
    price: '',
    availability: true,
    image: ''
  });

  const canManageCars = user && ['supervisor', 'employee'].includes(user?.role);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await CarService.getAllCars();
      const cars = response.data.map(car => ({
        id: car.id,
        name: car.model,
        brand: car.brand,
        year: car.year,
        price: car.price,
        formattedPrice: `₹${car.price.toLocaleString()}`,
        image: car.image || '/default-car.jpg',
        availability: car.availability
      }));
      setFeaturedCars(cars);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Error loading vehicles.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCar({
      ...newCar,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      await CarService.addCar({
        ...newCar,
        price: Number(newCar.price),
        year: Number(newCar.year)
      });
      setNewCar({
        model: '',
        brand: '',
        year: new Date().getFullYear(),
        price: '',
        availability: true,
        image: ''
      });
      setShowAddCarForm(false);
      fetchCars();
    } catch (err) {
      console.error('Error adding car:', err);
      setError('Failed to add vehicle.');
    }
  };

  const handleDeleteCar = async (carId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await CarService.deleteCar(carId);
        fetchCars();
      } catch (err) {
        console.error('Error deleting car:', err);
        setError('Failed to delete vehicle.');
      }
    }
  };

  const handleSelectCar = (car, targetSection) => {
    if (setSelectedCar) setSelectedCar(car);
    setActiveSection(targetSection);
  };

  if (loading) return <div className="section-loading">Loading vehicles...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <section className="featured-cars section">
      <div className="section-header">
        <h2>{isManageMode ? 'Manage Vehicles' : 'Available Models'}</h2>
        {canManageCars && (
          <button
            className="add-car-btn"
            onClick={() => setShowAddCarForm(!showAddCarForm)}
          >
            {showAddCarForm ? 'Cancel' : 'Add New Vehicle'}
          </button>
        )}
      </div>

      {showAddCarForm && canManageCars && (
        <div className="add-car-form">
          <h3>Add New Vehicle</h3>
          <form onSubmit={handleAddCar}>
            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input type="text" id="brand" name="brand" value={newCar.brand} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="model">Model</label>
              <input type="text" id="model" name="model" value={newCar.model} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="year">Year</label>
              <input type="number" id="year" name="year" min="1900" max={new Date().getFullYear() + 1} value={newCar.year} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price (₹)</label>
              <input type="number" id="price" name="price" min="0" step="0.01" value={newCar.price} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input type="text" id="image" name="image" value={newCar.image} onChange={handleInputChange} placeholder="https://example.com/car.jpg" />
            </div>
            <div className="form-group checkbox">
              <label htmlFor="availability">Available</label>
              <input type="checkbox" id="availability" name="availability" checked={newCar.availability} onChange={handleInputChange} />
            </div>
            <button type="submit" className="submit-btn">Add Vehicle</button>
          </form>
        </div>
      )}

      <div className="cars-grid">
        {featuredCars.length > 0 ? (
          featuredCars.map(car => (
            <div className="car-card" key={car.id}>
              <img src={car.image} alt={`${car.brand} ${car.name}`} />
              <div className="car-info">
                <h2>{car.name}</h2>
                <div className="car-brand">{car.brand}</div>
                <div className="car-year">{car.year}</div>
                <div className="car-price">{car.formattedPrice}</div>
                <div className="car-availability">
                  {car.availability ? 'Available' : 'Not Available'}
                </div>
                <div className="car-actions">
                  {user?.role === 'customer' && car.availability && (
                    <button className="test-drive-btn" onClick={() => handleSelectCar(car, 'testdrive')}>
                      Book Test Drive
                    </button>
                  )}
                  {user?.role === 'customer' && (
                    <button className="book-car-btn" onClick={() => handleSelectCar(car, 'bookings')}>
                      Book Now
                    </button>
                  )}
                  {canManageCars && (
                    <button className="edit-btn" onClick={() => alert('Edit functionality to be implemented')}>
                      Edit
                    </button>
                  )}
                  {user?.role === 'supervisor' && (
                    <button className="delete-btn" onClick={() => handleDeleteCar(car.id)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No vehicles currently available. Please check back later.</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedVehicles;
