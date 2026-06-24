import React, { useState } from 'react';

const AddCarForm = ({ addCar }) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    addCar({
      id: Number(id),
      name: name
    });

    setId('');
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Car ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <input
        type="text"
        placeholder="Car Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button type="submit">Add Car</button>
    </form>
  );
};

export default AddCarForm;