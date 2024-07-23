import './AddCarModal.css';
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const AddCarModal = ({ isOpen, onRequestClose, newCar, handleChange, handleAdd }) => {
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
        <form onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}>
          <input
            type="text"
            name="battery"
            value={newCar.battery}
            onChange={handleChange}
            placeholder="Battery"
          />
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
          <input
            type="text"
            name="efficiency"
            value={newCar.efficiency}
            onChange={handleChange}
            placeholder="Efficiency"
          />
          <input
            type="text"
            name="fast_charge"
            value={newCar.fast_charge}
            onChange={handleChange}
            placeholder="Fast Charge"
          />
          <input
            type="text"
            name="price"
            value={newCar.price}
            onChange={handleChange}
            placeholder="Price"
          />
          <input
            type="text"
            name="range"
            value={newCar.range}
            onChange={handleChange}
            placeholder="Range"
          />
          <input
            type="text"
            name="top_speed"
            value={newCar.top_speed}
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
          <button type="submit">{newCar.id ? 'Update' : 'Add'}</button>
        </form>
        <button onClick={onRequestClose}>Close</button>
      </div>
    </Modal>
  );
};

export default AddCarModal;
