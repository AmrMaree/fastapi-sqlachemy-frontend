import React, { useState } from 'react'

const NavBar = ({ onSearch }) => {

    const [searchQuery, setSearchQuery] = useState('');

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="logo">
                    <img src="/logo512.png" alt="Logo" className="logo-image" />
                </div>
                <div className='navbar-buttons'>
                    <button>Users</button>
                    <button className='active'>Posts</button>
                </div>
                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleInputChange}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">Search</button>
                </form>
            </div>
        </nav>
    )
}

export default NavBar