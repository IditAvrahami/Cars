import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import Card from './Card';  // Import the Card component

const ExcelReader = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/EV_cars_exel.xlsx')
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setData(jsonData);
      })
      .catch(error => console.error('Error fetching the Excel file:', error));
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {data.map((item, index) => (
          <Card key={index} data={item} />
        ))}
      </div>
    </div>
  );
};

export default ExcelReader;

