import React from 'react';
import PostContainer from './PostContainer';
import NavBar from './NavBar';
import UserContainer from './UserContainer';

const Home = () => {

    const handleSearch = (query) => {
        console.log('Searching for:', query);
    };

    return (
        <>
            <NavBar onSearch={handleSearch} />
            <PostContainer />
            <UserContainer />
        </>
    )
}

export default Home