import React from 'react';

const BestModels = ({ bestModels }) => {
  if (!bestModels) return null;

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
