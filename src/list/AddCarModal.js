import Modal from 'react-modal';
import React, { useState } from 'react';

Modal.setAppElement('#root');

const AddCarModal = ({ isOpen, onRequestClose, newCar, handleChange, handleAdd}) => {
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form:', newCar);
    newCar.AnnualCost = 10;
    if (validate()) {
      console.log('Validation passed, calling handleAdd');
      handleAdd();
    } else {
      console.log('Validation failed:', errors);
    }
  };

    const validate = () => {
    const newErrors = {};

    // Check for empty values
    Object.keys(newCar).forEach((key) => {
      if (!newCar[key]) {
        newErrors[key] = 'This field is required';
      }
    });

    // Validate specific fields
    if (isNaN(newCar.battery)) newErrors.battery = 'Battery must be a number';
    if (isNaN(newCar.efficiency)) newErrors.efficiency = 'Efficiency must be a number';
    if (isNaN(newCar.fast_charge)) newErrors.fast_charge = 'Fast Charge must be a number';
    if (isNaN(newCar.price)) newErrors.price = 'Price must be a number';
    if (isNaN(newCar.range)) newErrors.range = 'Range must be a number';
    if (isNaN(newCar.top_speed)) newErrors.top_speed = 'Top Speed must be a number';
    if (isNaN(newCar.acceleration) || newCar.acceleration < 0 || newCar.acceleration > 100) 
      newErrors.acceleration = 'Acceleration must be a number between 0 and 100';

    // Validate URL
    const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,6}([\/a-z0-9-]*)*$/i;
    if (newCar.car_name_link && !urlPattern.test(newCar.car_name_link)) newErrors.car_name_link = 'Car Name Link must be a valid URL';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={newCar.id ? 'Edit Car' : 'Add Car'}
      className="Modal"
      overlayClassName="Overlay"
    >
      <h2>{newCar.id ? 'Edit Car' : 'Add Car'}</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="battery"
            value={newCar.battery}
            onChange={handleChange}
            placeholder="Battery"
          />
          {errors.battery && <p className="error">{errors.battery}</p>}
          <input
            type="text"
            name="car_name"
            value={newCar.car_name}
            onChange={handleChange}
            placeholder="Car Name"
          />
          <input
            type="text"
            name="car_name_link"
            value={newCar.car_name_link}
            onChange={handleChange}
            placeholder="Car Name Link"
          />
          {errors.car_name_link && <p className="error">{errors.car_name_link}</p>}
          <input
            type="text"
            name="efficiency"
            value={newCar.efficiency}
            onChange={handleChange}
            placeholder="Efficiency"
          />
          {errors.efficiency && <p className="error">{errors.efficiency}</p>}
          <input
            type="text"
            name="fast_charge"
            value={newCar.fast_charge}
            onChange={handleChange}
            placeholder="Fast Charge"
          />
          {errors.fast_charge && <p className="error">{errors.fast_charge}</p>}
          <input
            type="text"
            name="price"
            value={newCar.price}
            onChange={handleChange}
            placeholder="Price"
          />
          {errors.price && <p className="error">{errors.price}</p>}
          <input
            type="text"
            name="range"
            value={newCar.range}
            onChange={handleChange}
            placeholder="Range"
          />
          {errors.range && <p className="error">{errors.range}</p>}
          <input
            type="text"
            name="top_speed"
            value={newCar.top_speed}
            onChange={handleChange}
            placeholder="Top Speed"
          />
          {errors.top_speed && <p className="error">{errors.top_speed}</p>}
          <input
            type="text"
            name="acceleration"
            value={newCar.acceleration}
            onChange={handleChange}
            placeholder="Acceleration (0-100)"
          />
          {errors.acceleration && <p className="error">{errors.acceleration}</p>}
          <button type="submit">{newCar.id ? 'Update' : 'Add'}</button>
        </form>
        <button onClick={onRequestClose}>Close</button>
      </div>
    </Modal>
  );
};

export default AddCarModal;
