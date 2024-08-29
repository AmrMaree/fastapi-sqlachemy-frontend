import React, { useEffect, useState } from 'react'
import api from '../api'
import EditUser from './EditUser';
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

    const closeEditUser = () => {
        setIsEditOpen(false);
        setUserId(null);
    };

    const handleSave = async () => {
        await fetchUsers();
        closeEditUser();
    };

    const openConfirmationDialog = (userId) => {
        setDeleteUserId(userId);
        setIsDeleteUserOpen(true);
        setActiveMenu(null);
    };

    const handleOpenAddUser = () => {
        setIsAddUserOpen(true);
        setActiveMenu(null);
    }

    const handleCloseAddUser = () => {
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
            await fetchUsers();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
        setIsDeleteUserOpen(false);
        setDeleteUserId(null);
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data)
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    return (
        <>
            <div className='posts-container'>
                <div className='posts-container-header'>
                    <h2>Users</h2>
                    <button type='button' className='add-post-button' onClick={handleOpenAddUser}>Add User</button>
                </div>
                <table border='1'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <div className="settings-container">
                                        <span className="settings-icon" onClick={() => toggleMenu(user.id)}>
                                            ...
                                        </span>
                                        {activeMenu === user.id && (
                                            <div className="settings-menu">
                                                <div className="settings-item" onClick={() => openEditPost(user.id)}>Edit</div>
                                                <div className="settings-item" onClick={() => openConfirmationDialog(user.id)}>Delete</div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isEditOpen && (
                    <EditUser
                        user_id={userId}
                        onClose={closeEditUser}
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
                        onClose={handleCloseAddUser}
                        onSave={handleSave}
                    />
                )}
            </div>
        </>
    );
};

export default UserContainer;