import React, { useState } from 'react'
import api from '../api';

const AddPost = ({ onClose, onSave }) => {
    const [post, setPost] = useState({ title: '', content: '' });
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId')

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPost({
            ...post,
            [name]: value
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/posts/", {
                title: post.title,
                content: post.content,
                userid: parseInt(userId)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Post created successfully:', response.data);
            if (onSave) onSave();
            onClose();
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div className="add-post">
            <div className="add-post-content">
                <h2>Add Post</h2>
                <form>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={post.title}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Content:</label>
                        <textarea
                            name="content"
                            value={post.content}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="add-post-buttons">
                        <button type="submit" onClick={handleSave}>Save</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddPost