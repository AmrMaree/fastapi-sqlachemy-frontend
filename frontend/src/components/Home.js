import React, { useState } from 'react';
import PostContainer from './PostContainer';
import NavBar from './NavBar';
import UserContainer from './UserContainer';

const Home = () => {
    const [isUsersOpen, setIsUsersOpen] = useState(false);
    const [isPostsOpen, setIsPostsOpen] = useState(true);

    const handleSearch = (query) => {
        console.log('Searching for:', query);
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