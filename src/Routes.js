import './Routes.css'
import {
    Route,
    Routes
  } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import React, {useState} from "react";
import CsvReader from './list/CsvReader';



function AppRoutes() {
    const [currentPage, setCurrentPage] = useState('');
    const navigate = useNavigate();

    /**
     * @description - navigate to some tab
     * @param {*} url 
     */
    const navigateTo = (url) => {
        setCurrentPage(url);
        navigate('/'+ url)
    }
    
    const NavBar = () => (
        <header className='navbar'>
            <div className='navbar__title navbar__item'>Idit Project</div>
            {/* <div className='navbar__item' className={currentPage === '' ? 'navbar__item active' : 'navbar__item not_active'}  onClick={navigateTo.bind(this, '')}>דף הבית</div> */}
            <div className='navbar__item' className={currentPage === 'data' ? 'navbar__item active' : 'navbar__item not_active'} onClick={navigateTo.bind(this, '')}>מכוניות</div>    
        </header>
    );

    return (     
        <div className="App">
            {NavBar()}
            {/* <div className="menu"></div> */}
            <div className="App-intro">
                <Routes>
                    <Route path="/" element={<CsvReader/>}/> 
                </Routes>
            </div>
      </div>
    );
  }
  
  export default AppRoutes;