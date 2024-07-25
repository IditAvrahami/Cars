
import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import './CsvReader.css';
import AddCarModal from './AddCarModal';
import { FaPlusCircle } from 'react-icons/fa';
import BestModels from './BestModels';


const getFirstWord = (carName) => carName ? carName.split(' ')[0] : '';
const removeFirstWord = (str) => str ? str.split(' ').slice(1).join(' ') : '';

const CsvReader = () => {
  const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCar, setNewCar] = useState({
    battery: '',
    car_name: '',
    car_name_link: '',
    efficiency: '',
    fast_charge: '',
    price: '',
    range: '',
    top_speed: '',
    acceleration: '',
  });
  const [stateOptions, setStateOptions] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [electricityData, setElectricityData] = useState({});

  useEffect(() => {
    const fetchElectricityData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/electricity-data');
        if (!response.ok) {
          throw new Error('Failed to fetch electricity data');
        }
        const data = await response.json();
        
        // Filter electricity data for residential sector and create a mapping
        const residentialData = data.filter(row => row.sectorName === 'residential');
        const statePriceMap = {};
        residentialData.forEach(row => {
          if (row.stateDescription) {
            statePriceMap[row.stateDescription] = row.price;
          }
        });

        setElectricityData(statePriceMap);
        setStateOptions(Object.keys(statePriceMap));
      } catch (error) {
        console.error('Error fetching electricity data:', error);
      }
    };

    fetchElectricityData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch car data from the API
        const carResponse = await fetch('http://localhost:5000/api/cars');
        if (!carResponse.ok) {
          throw new Error('Failed to fetch car data');
        }
        const carData = await carResponse.json();
        console.log('Car data:', carData); // Debugging line

        // Fetch exchange rate HTTP GET request
        const exchangeRateResponse = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
        const exchangeRateData = await exchangeRateResponse.json();
        const exchangeRate = exchangeRateData.rates.ILS;

        const processedData = carData.map(row => ({
          ...row,
          FirstWord: getFirstWord(row.car_name),
          PriceShekels: (row.price ? parseFloat(row.price) * exchangeRate : ''),
          AnnualCost: (selectedState && row.price && row.battery && row.range) 
            ? (15000 * row.range) / (row.battery * (electricityData[selectedState] || 1)) 
            : ''
        }));

        setData(processedData);
      } catch (error) {
        console.error('Error fetching and parsing data:', error);
      }
    };

    fetchData();
  }, [selectedState, electricityData]);

  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div>
            <button onClick={() => handleDelete(row.original.id)}>מחיקה</button>
            <button onClick={() => handleEdit(row.original)}>עריכה</button>
          </div>
        ),
        disableSortBy: true
      },
      { Header: 'עלות שנתית ($)', accessor: 'AnnualCost' },
      { Header: 'תאוצה (0-100)', accessor: 'acceleration' },
      { Header: 'מהירות מקסימלית', accessor: 'top_speed' },
      { Header: 'טווח', accessor: 'range' }, 
      { Header: 'טעינה מהירה', accessor: 'fast_charge' },
      { Header: 'יעילות', accessor: 'efficiency' },
      { Header: 'חיי סוללה', accessor: 'battery' },
      { Header: 'מחיר (בשקל)', accessor: 'PriceShekels' },
      { Header: 'מחיר (באירו)', accessor: 'price' },
      {
        Header: 'קישור',
        accessor: 'car_name_link',
        Cell: ({ row }) => (
          <a href={row.original.car_name_link} target="_blank" rel="noopener noreferrer">
            {removeFirstWord(row.original.car_name)}
          </a>
        )
      },
      { Header: 'סוג מכונית', accessor: 'car_name' },
      { Header: 'חברה', accessor: 'FirstWord' }
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

const handleAdd = async () => {
    try {
      const method = newCar.id ? 'PUT' : 'POST'; // Determine if it's an update or add
      const url = newCar.id ? `http://localhost:5000/api/cars/${newCar.id}` : 'http://localhost:5000/api/cars';
      console.log("method: ", method)
      console.log("url: ", url)
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCar)
      });
  
      if (!response.ok) {
        throw new Error(`Failed to ${method === 'POST' ? 'add' : 'update'} car`);
      }
  
      const updatedCar = await response.json();
      setData(prevData => {
        if (method === 'POST') {
          return [...prevData, { ...updatedCar, FirstWord: getFirstWord(updatedCar.car_name) }];
        } else {
          return prevData.map(car => car.id === updatedCar.id ? updatedCar : car);
        }
      });
  
      setNewCar({
        battery: '',
        car_name: '',
        car_name_link: '',
        efficiency: '',
        fast_charge: '',
        price: '',
        range: '',
        top_speed: '',
        acceleration: '',
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error(`Error ${newCar.id ? 'updating' : 'adding'} car:`, error);
    }
  };
  

const handleEdit = (car) => {
    setNewCar(car);
    setIsModalOpen(true);
  };


const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/cars/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete car');
      }
      setData(prevData => prevData.filter(car => car.id !== id));
    } catch (error) {
      console.error('Error deleting car:', error);
    }
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
        <BestModels/>
        {/* sort dropdown */}
      <div className="sort-dropdown">
        <label htmlFor="sort-by">סינון לפי</label>
        <select id="sort-by" onChange={handleSortChange}>
          <option value="">בחר נושא</option>
          {columns
            .filter(column => !column.disableSortBy)
            .map(column => (
              <option key={column.accessor} value={column.accessor}>
                {column.Header}
              </option>
            ))}
        </select>
      </div>
      {/* states dropdown */}
      <div className="state-dropdown">
        <label htmlFor="state-select">שם מדינה</label>
        <select id="state-select" onChange={handleStateChange} value={selectedState}>
          <option value="">בחר מדינה</option>
          {stateOptions.map(state => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
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
      <table {...getTableProps()} className="data-table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
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
