import React, { useState, useEffect } from 'react'
import api from '../api'

const EditUser = ({ user_id, onSave, onClose }) => {
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/users/${user_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Fetched user data:', response.data);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUser();
    }, [token, user_id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const handleSave = async () => {
        try {
            const response = await api.put(`/users/${user_id}`, user, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('user updated successfully:', response.data);
            if (onSave) onSave();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="edit-post">
            <div className="edit-post-content">
                <h2>Edit user</h2>
                <form>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="text"
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Role:</label>
                        <input
                            type="text"
                            name="role"
                            value={user.role}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="edit-post-buttons">
                        <button type="button" onClick={handleSave}>Save</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditUser