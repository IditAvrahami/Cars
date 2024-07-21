// src/CsvReader.js
import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { useTable, useSortBy } from 'react-table';
import { FaPlusCircle } from 'react-icons/fa';
import AddCarModal from './AddCarModal';
import BestModels from './BestModels';
import './CsvReader.css';

const getFirstWord = (carName) => carName ? carName.split(' ')[0] : '';
const removeFirstWord = (str) => str ? str.split(' ').slice(1).join(' ') : '';

const CsvReader = () => {
  const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const [stateOptions, setStateOptions] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [electricityData, setElectricityData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch and process car data
        const carResponse = await fetch('/EV_cars_exel.xlsx');
        const carBuffer = await carResponse.arrayBuffer();
        const carWorkbook = XLSX.read(carBuffer, { type: 'array' });
        const carWorksheet = XLSX.utils.sheet_to_json(carWorkbook.Sheets[carWorkbook.SheetNames[0]]);

        // Fetch and process electricity data
        const electricityResponse = await fetch('/electricity.xlsx');
        const electricityBuffer = await electricityResponse.arrayBuffer();
        const electricityWorkbook = XLSX.read(electricityBuffer, { type: 'array' });
        const electricityWorksheet = XLSX.utils.sheet_to_json(electricityWorkbook.Sheets[electricityWorkbook.SheetNames[0]]);
        
        // Filter electricity data for residential sector and create a mapping
        const residentialData = electricityWorksheet.filter(row => row.sectorName === 'residential');
        const statePriceMap = {};
        residentialData.forEach(row => {
          if (row.stateDescription) {
            statePriceMap[row.stateDescription] = row.price;
          }
        });

        setElectricityData(statePriceMap);

        // Process car data with exchange rate
        const exchangeRateResponse = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
        const exchangeRateData = await exchangeRateResponse.json();
        const exchangeRate = exchangeRateData.rates.ILS;

        const processedData = carWorksheet.map(row => ({
          ...row,
          FirstWord: getFirstWord(row.Car_name),
          PriceShekels: (row.Price ? parseFloat(row.Price) * exchangeRate : ''),
          AnnualCost: selectedState && row.Price && row.Battery && row.Range 
            ? (15000 * row.Range) / (row.Battery * (statePriceMap[selectedState] || 1)) 
            : ''
        }));

        setData(processedData);
        setStateOptions(Object.keys(statePriceMap));

      } catch (error) {
        console.error('Error fetching and parsing data:', error);
      }
    };

    fetchData();
  }, [selectedState]);

  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div>
            <button onClick={() => handleDelete(row.index)}>Delete</button>
          </div>
        ),
        disableSortBy: true
      },
      { Header: 'עלות שנתית ($)', accessor: 'AnnualCost' },
      { Header: 'האצה (0-100)', accessor: 'acceleration' },
      { Header: 'מהירות מקסימלית', accessor: 'Top_speed' },
      { Header: 'טווח', accessor: 'Range' }, 
      { Header: 'זמן טעינה', accessor: 'Fast_charge' },
      { Header: 'יעילות', accessor: 'Efficiency' },
      { Header: 'חיי סוללה', accessor: 'Battery' },
      { Header: 'מחיר(בשקל)', accessor: 'PriceShekels' },
      { Header: 'מחיר (אירו)', accessor: 'Price' },
      {
        Header: 'לינק',
        accessor: 'Car_name_link',
        Cell: ({ row }) => (
          <a href={row.original.Car_name_link} target="_blank" rel="noopener noreferrer">
            {removeFirstWord(row.original.Car_name)}
          </a>
        )
      },
      { Header: 'שם הרכב', accessor: 'Car_name' },
      { Header: 'שם החברה', accessor: 'FirstWord' }
    ],
    [data]
  );

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
    setIsModalOpen(false);
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
    setSortBy([{ id: column, desc: false }]);
    setTableSortBy([{ id: column, desc: false }]);
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  return (
    <div className="csv-reader">
      <h2>EV Cars Data</h2>
      <BestModels data={data} />
      <div className="icon-container">
        <button className="add-car-button" onClick={() => setIsModalOpen(true)}>
          <FaPlusCircle size={30} />
        </button>
      </div>
      <AddCarModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        newCar={newCar}
        handleChange={handleChange}
        handleAdd={handleAdd}
      />
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
      <div className="state-dropdown">
        <label htmlFor="state-select">Select State:</label>
        <select id="state-select" onChange={handleStateChange} value={selectedState}>
          <option value="">Select State</option>
          {stateOptions.map(state => (
            <option key={state} value={state}>
              {state}
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
    </div>
  );
};

export default CsvReader;
