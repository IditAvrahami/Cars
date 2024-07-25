import './Routes.css';
import {
    Route,
    Routes
} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import CsvReader from './list/CsvReader';

function AppRoutes() {
    const [currentPage, setCurrentPage] = useState('');
    const navigate = useNavigate();

    // Function to navigate to different routes
    const navigateTo = (url) => {
        setCurrentPage(url);
        navigate('/' + url);
    };

    // Function to fetch data from the API
    const apiUrl = process.env.REACT_APP_API_URL;
    const fetchData = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/load-data`);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Call fetchData when the component mounts
    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this effect runs only once after the initial render

    const NavBar = () => (
        <header className='navbar'>
            <div className='navbar__title navbar__item'>הפרוייקט של עידית</div>
            <div className='navbar__item' className={currentPage === 'data' ? 'navbar__item active' : 'navbar__item not_active'} onClick={navigateTo.bind(this, '')}>מכוניות</div>    
        </header>
    );

    return (     
        <div className="App">
            {NavBar()}
            <div className="App-intro">
                <Routes>
                    <Route path="/" element={<CsvReader/>}/> 
                </Routes>
            </div>
      </div>
    );
}

export default AppRoutes;

