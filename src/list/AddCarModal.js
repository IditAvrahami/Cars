// src/components/AddCarModal.js
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const AddCarModal = ({ isOpen, onRequestClose, newCar, handleChange, handleAdd }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add New Car"
      className="Modal"
      overlayClassName="Overlay"
    >
      <div className="form-container">
        <h3>Add New Car</h3>
        <form>
          <input
            type="text"
            name="Battery"
            value={newCar.Battery}
            onChange={handleChange}
            placeholder="Battery"
          />
          <input
            type="text"
            name="Car_name"
            value={newCar.Car_name}
            onChange={handleChange}
            placeholder="Car Name"
          />
          <input
            type="text"
            name="Car_name_link"
            value={newCar.Car_name_link}
            onChange={handleChange}
            placeholder="Car Name Link"
          />
          <input
            type="text"
            name="Efficiency"
            value={newCar.Efficiency}
            onChange={handleChange}
            placeholder="Efficiency"
          />
          <input
            type="text"
            name="Fast_charge"
            value={newCar.Fast_charge}
            onChange={handleChange}
            placeholder="Fast Charge"
          />
          <input
            type="text"
            name="Price"
            value={newCar.Price}
            onChange={handleChange}
            placeholder="Price"
          />
          <input
            type="text"
            name="Range"
            value={newCar.Range}
            onChange={handleChange}
            placeholder="Range"
          />
          <input
            type="text"
            name="Top_speed"
            value={newCar.Top_speed}
            onChange={handleChange}
            placeholder="Top Speed"
          />
          <input
            type="text"
            name="acceleration"
            value={newCar.acceleration}
            onChange={handleChange}
            placeholder="Acceleration (0-100)"
          />
          <button type="button" onClick={handleAdd}>
            Add Car
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default AddCarModal;
