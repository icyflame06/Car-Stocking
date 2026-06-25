import React, { useEffect, useState } from 'react';
import api from "../api.js";
import "../App.css";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({ id: '', name: '' });
  const [editCars, setEditCars] = useState({});

  const fetchCars = async () => {
    try {
      const response = await api.get('/cars');
      
      // --- ROBUST API PARSING ---
      let carData = [];
      
      if (Array.isArray(response.data)) {
        // Handle direct array returns: response.data = [...]
        carData = response.data;
      } else if (response.data && Array.isArray(response.data.cars)) {
        // Handle nested cars array: response.data.cars = [...]
        carData = response.data.cars;
      } else if (response.data && typeof response.data === 'object') {
        // Fallback fallback: Search object values for any array
        const foundArray = Object.values(response.data).find(val => Array.isArray(val));
        if (foundArray) carData = foundArray;
      }

      setCars(carData);
      
      // Safely initialize editing states
      const initialEditState = {};
      carData.forEach(car => {
        if (car && car.id) {
          initialEditState[car.id] = { id: car.id, name: car.name || '' };
        }
      });
      setEditCars(initialEditState);
      
    } catch (error) {
      console.error("Error fetching cars", error);
    }
  };

  // CRUD Operations
  const handleCreate = async () => {
    if (!newCar.id || !newCar.name) return alert("Please fill out ID and Car Name");
    try {
      await api.post('/cars', { id: Number(newCar.id), name: newCar.name });
      setNewCar({ id: '', name: '' });
      fetchCars();
    } catch (error) {
      console.error('Error adding car', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const updatedCar = editCars[id];
      await api.put(`/cars/${id}`, { id: Number(updatedCar.id), name: updatedCar.name });
      fetchCars();
    } catch (error) {
      console.error('Error updating car', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/cars/${id}`);
      fetchCars();
    } catch (error) {
      console.error('Error deleting car', error);
    }
  };

  const handleEditChange = (id, field, value) => {
    setEditCars(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="management-container">
      {/* Row 1: Create Form */}
      <div className="crud-row">
        <input
          type="number"
          placeholder="ID"
          className="crud-input"
          value={newCar.id}
          onChange={(e) => setNewCar({ ...newCar, id: e.target.value })}
        />
        <input
          type="text"
          placeholder="Car Name"
          className="crud-input"
          value={newCar.name}
          onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
        />
        <button className="crud-btn" onClick={handleCreate}>Create</button>
      </div>

      {/* Dynamic Rows: Ensuring cars layout is safe from runtime array issues */}
      {Array.isArray(cars) && cars.map((car) => {
        if (!car) return null;
        const currentEdit = editCars[car.id] || { id: car.id, name: car.name };
        return (
          <React.Fragment key={car.id}>
            {/* Row 2: Update Layout */}
            <div className="crud-row">
              <input
                type="number"
                className="crud-input"
                value={currentEdit.id || ''}
                onChange={(e) => handleEditChange(car.id, 'id', e.target.value)}
              />
              <input
                type="text"
                className="crud-input"
                value={currentEdit.name || ''}
                onChange={(e) => handleEditChange(car.id, 'name', e.target.value)}
              />
              <button className="crud-btn" onClick={() => handleUpdate(car.id)}>Update</button>
            </div>

            {/* Row 3: Delete Layout */}
            <div className="crud-row">
              <input
                type="number"
                className="crud-input"
                value={car.id || ''}
                disabled
              />
              <input
                type="text"
                className="crud-input"
                value={car.name || ''}
                disabled
              />
              <button className="crud-btn delete-btn" onClick={() => handleDelete(car.id)}>Delete</button>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CarList;