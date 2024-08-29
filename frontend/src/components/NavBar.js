import React, { useState } from 'react'

const NavBar = ({ onSearch, isUsersOpen, isPostsOpen, setIsUsersOpen, setIsPostsOpen }) => {

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

    const handleUsersClick = () => {
        setIsUsersOpen(true);
        setIsPostsOpen(false);
    }

    const handlePostsClick = () => {
        setIsPostsOpen(true);
        setIsUsersOpen(false);
    }

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="logo">
                    <img src="/logo512.png" alt="Logo" className="logo-image" />
                </div>
                <div className='navbar-buttons'>
                    <button className={isUsersOpen ? "active" : ""} onClick={handleUsersClick}>Users</button>
                    <button className={isPostsOpen ? "active" : ""} onClick={handlePostsClick}>Posts</button>
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