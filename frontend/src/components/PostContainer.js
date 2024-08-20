import React, { useEffect, useState } from 'react'
import api from '../api'
import EditPost from './EditPost';


const PostContainer = () => {
    const [posts, setPosts] = useState([]);
    const token = localStorage.getItem('token');

    const [activeMenu, setActiveMenu] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [postId, setPostId] = useState(null);

    const toggleMenu = (postId) => {
        setActiveMenu(activeMenu === postId ? null : postId);
    };

    const openEditPost = (postId) => {
        setIsEditOpen(true);
        setActiveMenu(null);  // Close the settings menu
        setPostId(postId)
    };

    const closeEditPost = () => {
        setIsEditOpen(false);
        setPostId(null);
    };


    const handleSave = () => {
        //onUpdate(currentPost);  // Pass the updated post to the parent component
        closeEditPost();
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/posts/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [token]);

    return (
        <div className='posts-container'>
            <h2>Posts</h2>
            <table border='1'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Date Created</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                        <tr key={post.id}>
                            <td>{post.id}</td>
                            <td>{post.title}</td>
                            <td>{post.content}</td>
                            <td>{new Date(post.created_at).toLocaleString()}</td>
                            <td>
                                <div className="settings-container">
                                    <span className="settings-icon" onClick={() => toggleMenu(post.id)}>
                                        ...
                                    </span>
                                    {activeMenu === post.id && (
                                        <div className="settings-menu">
                                            <div className="settings-item" onClick={() => openEditPost(post.id)}>Edit</div>
                                            <div className="settings-item">Delete</div>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isEditOpen && <EditPost post_id={postId} />}
        </div>
    );
};

export default PostContainer;