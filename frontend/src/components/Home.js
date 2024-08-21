import React from 'react';
import PostContainer from './PostContainer';
import NavBar from './NavBar';

const Home = () => {

    const handleSearch = (query) => {
        console.log('Searching for:', query);
    };

    return (
        <>
            <NavBar onSearch={handleSearch} />
            <PostContainer />
        </>
    )
}

export default Home