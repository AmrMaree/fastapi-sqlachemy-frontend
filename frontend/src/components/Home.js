import React, { useState } from 'react';
import PostContainer from './PostContainer';
import NavBar from './NavBar';
import UserContainer from './UserContainer';
import api from '../api';

const Home = () => {
    const [isUsersOpen, setIsUsersOpen] = useState(false);
    const [isPostsOpen, setIsPostsOpen] = useState(true);
    const token = localStorage.getItem("token");

    const handleSearch = async (query) => {
        try {
            const response = await api.delete(``, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data)
            console.log('Searching for:', query);
        } catch (error) {
            console.error('Error while searching:', error);
        }
    };

    return (
        <>
            <NavBar
                onSearch={handleSearch}
                isUsersOpen={isUsersOpen}
                isPostsOpen={isPostsOpen}
                setIsUsersOpen={setIsUsersOpen}
                setIsPostsOpen={setIsPostsOpen}
            />
            {isUsersOpen && <UserContainer />}
            {isPostsOpen && <PostContainer />}
        </>
    )
}

export default Home