import React from 'react';

const Card = ({ data }) => {
  return (
    <div style={{
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      padding: '16px', 
      margin: '8px', 
      width: '200px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    }}>
      {/* <div><strong>{data.Car_name.trim().split(' ')[0]}</strong></div>
      <a href={data.Car_name_link} target="_blank" rel="noopener noreferrer">{data.Car_name.trim().split(' ').slice(1).join(' ')}</a>
      {/* <div>מחיר: {data.['Price.DE.']}</div> */}
      {/* <div style={{ marginBottom: '8px' }}>
          <strong>טווח: </strong>{data.Range}
        </div> */} 

      {Object.keys(data).map((key, index) => (
        <div key={index} style={{ marginBottom: '8px' }}>
          <strong>{key}: </strong>{data[key]}
        </div>
      ))}
    </div>
  );
};

export default Card;
