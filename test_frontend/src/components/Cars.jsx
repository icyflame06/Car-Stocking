import React, { useEffect, useState } from 'react';
import api from "../api.js";
import AddCarForm from './AddCarForm';

const CarList = () => {
  const [cars, setCars] = useState([]);

  const fetchCars = async () => {
    try {
      const response = await api.get('/cars');

      console.log("Cars received:", response.data);

      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars", error);
    }
  };

  const addCar = async (car) => {
    try {
      await api.post('/cars', car);
      fetchCars();
    } catch (error) {
      console.error("Error adding car", error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div>
      <h2>Cars List</h2>

      <ul>
        {cars.map((car) => (
          <li key={car.id}>
            ID: {car.id} | Name: {car.name}
          </li>
        ))}
      </ul>

      <AddCarForm addCar={addCar} />
    </div>
  );
};

export default CarList;