import React, { useEffect, useState } from 'react'
import api from '../api'
import EditPost from './EditPost';
import ConfirmationDialog from './ConfirmationDialog';
import AddPost from './AddPost';

const UserContainer = () => {
    const [users, setUsers] = useState([]);
    const [activeMenu, setActiveMenu] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);

    const token = localStorage.getItem('token');

    const toggleMenu = (userId) => {
        setActiveMenu(activeMenu === userId ? null : userId);
    };

    const openEditPost = (userId) => {
        setIsEditOpen(true);
        setActiveMenu(null);
        setUserId(userId);
    };

    const closeEditPost = () => {
        setIsEditOpen(false);
        setUserId(null);
    };

    const openPostComments = (userId) => {
        setActiveMenu(null);
        setUserId(userId);
    }

    const handleSave = async () => {
        await fetchusers();
        closeEditPost();
    };

    const openConfirmationDialog = (userId) => {
        setDeleteUserId(userId);
        setIsDeleteUserOpen(true);
        setActiveMenu(null);
    };

    const handleOpenAddPost = () => {
        setIsAddUserOpen(true);
    }

    const handleCloseAddPost = () => {
        setIsAddUserOpen(false);
    }

    const handleDelete = async () => {
        try {
            const response = await api.delete(`/users/${deleteUserId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data)
            await fetchusers();  // Refresh users list after deletion
        } catch (error) {
            console.error('Error deleting post:', error);
        }
        setIsDeleteUserOpen(false);
        setDeleteUserId(null);
    };

    const fetchusers = async () => {
        try {
            const response = await api.get('/users/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchusers();
    }, [token]);

    return (
        <>
            <div className='users-container'>
                <div className='users-container-header'>
                    <h2>users</h2>
                    <button type='button' className='add-post-button' onClick={handleOpenAddPost}>Add Post</button>
                </div>
                <table border='1'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Content</th>
                            <th>Date Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((post) => (
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
                                                <div className="settings-item" onClick={() => openPostComments(post.id)}>Comments</div>
                                                <div className="settings-item" onClick={() => openConfirmationDialog(post.id)}>Delete</div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isEditOpen && (
                    <EditPost
                        post_id={userId}
                        onClose={closeEditPost}
                        onSave={handleSave}
                    />
                )}

                {isDeleteUserOpen && (
                    <ConfirmationDialog
                        message="Are you sure you want to delete this post?"
                        onConfirm={handleDelete}
                        onCancel={() => setIsDeleteUserOpen(false)}
                    />
                )}

                {isAddUserOpen && (
                    <AddPost
                        onClose={handleCloseAddPost}
                        onSave={handleSave}
                    />
                )}
            </div>
        </>
    );
};

export default UserContainer;