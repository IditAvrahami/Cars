import React from 'react';

const getBestModels = (data) => {
  if (data.length === 0) return {};

  return {
    fastest: data.reduce((prev, curr) => (prev.Top_speed > curr.Top_speed ? prev : curr), data[0]),
    agile: data.reduce((prev, curr) => (prev.acceleration < curr.acceleration ? prev : curr), data[0]),
    efficient: data.reduce((prev, curr) => (prev.Efficiency < curr.Efficiency ? prev : curr), data[0]), 
    range: data.reduce((prev, curr) => (prev.Range > curr.Range ? prev : curr), data[0]),
    battery: data.reduce((prev, curr) => (prev.Battery > curr.Battery ? prev : curr), data[0]),
  };
};

const BestModels = ({ data }) => {
  if (!data || data.length === 0) return null;

  const bestModels = getBestModels(data);

  return (
    <div className="best-models">
      <h2>Best Models</h2>
      <div className="best-model">
        <h3>Fastest</h3>
        <p>{bestModels.fastest.Car_name} ({bestModels.fastest.Top_speed} km/h)</p>
      </div>
      <div className="best-model">
        <h3>Agile (Fastest Acceleration)</h3>
        <p>{bestModels.agile.Car_name} ({bestModels.agile.acceleration} sec 0-100 km/h)</p>
      </div>
      <div className="best-model">
        <h3>Most Efficient</h3>
        <p>{bestModels.efficient.Car_name} ({bestModels.efficient.Efficiency} kWh/100 km)</p>
      </div>
      <div className="best-model">
        <h3>Longest Range</h3>
        <p>{bestModels.range.Car_name} ({bestModels.range.Range} km)</p>
      </div>
      <div className="best-model">
        <h3>Largest Battery Volume</h3>
        <p>{bestModels.battery.Car_name} ({bestModels.battery.Battery} kWh)</p>
      </div>
    </div>
  );
};

export default BestModels;
