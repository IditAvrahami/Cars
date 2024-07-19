import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { useTable, useSortBy } from 'react-table';
import BestModels from './BestModels'; // Import the new component
import './CsvReader.css';

// Function to get the first word from a car name
const getFirstWord = (carName) => {
  return carName ? carName.split(' ')[0] : '';
};

const removeFirstWord = (str) => {
    if (!str) return ''; // Return an empty string if input is null or undefined
    const words = str.split(' ');
    return words.slice(1).join(' ');
  };
  

const CsvReader = () => {
  const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [newCar, setNewCar] = useState({
    Battery: '',
    Car_name: '',
    Car_name_link: '',
    Efficiency: '',
    Fast_charge: '',
    Price: '',
    Range: '',
    Top_speed: '',
    acceleration: '',
  });

  useEffect(() => {
    fetch('/EV_cars_exel.xlsx')
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
        const processedData = worksheet.map(row => ({
          ...row,
          FirstWord: getFirstWord(row.Car_name) // Add first word to data
        }));
        setData(processedData);
      })
      .catch(error => {
        console.error('Error fetching and parsing Excel file:', error);
      });
  }, []);

////////////////////////////////////////////////////////////////////////////////////////////
const columns = useMemo(
    () => [
      { Header: 'Company', accessor: 'FirstWord' },
      { Header: 'Car Name', accessor: 'Car_name' },
      {
        Header: 'Link',
        accessor: 'Car_name_link',
        Cell: ({ row }) => (
          <a href={row.original.Car_name_link} target="_blank" rel="noopener noreferrer">
            {removeFirstWord(row.original.Car_name)}
          </a>
        )
      },
      { Header: 'Price (EUR)', accessor: 'Price' },
      { Header: 'Price (ILS)', accessor: 'PriceShekels' }, // New column for shekels
      { Header: 'Battery', accessor: 'Battery' },
      { Header: 'Efficiency', accessor: 'Efficiency' },
      { Header: 'Fast Charge', accessor: 'Fast_charge' },  
      { Header: 'Range', accessor: 'Range' },
      { Header: 'Top Speed', accessor: 'Top_speed' },
      { Header: 'Acceleration (0-100)', accessor: 'acceleration' },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div>
            <button onClick={() => handleDelete(row.index)}>Delete</button>
          </div>
        ),
        disableSortBy: true // Disable sorting for the Actions column
      }
    ],
    [data]
  );

  //Fetch the Exchange Rate,provides currency exchange rates.
  const fetchExchangeRate = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
      const data = await response.json();
      return data.rates.ILS; // ILS is the currency code for Israeli Shekel
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      return 0; // Return 0 if there's an error
    }
  };
  // check if the change is working
  //Convert Prices and Update State
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/EV_cars_exel.xlsx');
        const buffer = await response.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
  
        const exchangeRate = await fetchExchangeRate(); // Get exchange rate
  
        const processedData = worksheet.map(row => ({
          ...row,
          FirstWord: getFirstWord(row.Car_name),
          PriceShekels: (row.Price ? parseFloat(row.Price) * exchangeRate : '') // Convert price to shekels
        }));
  
        setData(processedData);
      } catch (error) {
        console.error('Error fetching and parsing Excel file:', error);
      }
    };
  
    fetchData();
  }, []);
  


////////////////////////////////////////////////////////////////////////////////////////////

  const tableInstance = useTable(
    { columns, data, initialState: { sortBy } },
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setSortBy: setTableSortBy
  } = tableInstance;

  const handleAdd = () => {
    setData(prevData => [
      ...prevData,
      { ...newCar, FirstWord: getFirstWord(newCar.Car_name) }
    ]);
    setNewCar({
      Battery: '',
      Car_name: '',
      Car_name_link: '',
      Efficiency: '',
      Fast_charge: '',
      Price: '',
      Range: '',
      Top_speed: '',
      acceleration: '',
    });
  };

  const handleDelete = (index) => {
    setData(prevData => prevData.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCar(prevCar => ({
      ...prevCar,
      [name]: value
    }));
  };

  const handleSortChange = (e) => {
    const column = e.target.value;
    setSortBy([{ id: column, desc: false }]); // Apply ascending sort
    setTableSortBy([{ id: column, desc: false }]); // Apply ascending sort in table
  };

  return (
    <div className="csv-reader">
      <h2>EV Cars Data</h2>
      
      <div className="sort-dropdown">
        <label htmlFor="sort-by">Sort by:</label>
        <select id="sort-by" onChange={handleSortChange}>
          <option value="">Select Column</option>
          {columns
            .filter(column => !column.disableSortBy)
            .map(column => (
              <option key={column.accessor} value={column.accessor}>
                {column.Header}
              </option>
            ))}
        </select>
      </div>

      <table {...getTableProps()} className="data-table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Show sort indicators for sortable columns */}
                  {!column.disableSortBy && (column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : '')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

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
    </div>
  );
};

export default CsvReader;
