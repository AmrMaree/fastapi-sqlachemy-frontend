import React, { useState } from 'react'
import api from '../api';

const AddComment = ({ post_id, onSave, onClose }) => {
    const [comment, setComment] = useState({ content: '' });
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId')

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setComment({
            ...comment,
            [name]: value
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/posts/${post_id}/comments`, {
                post_id: post_id,
                userid: parseInt(userId),
                content: comment.content
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('comment created successfully:', response.data);
            if (onSave) onSave();
            onClose();
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    if (!comment) {
        return <div>Loading...</div>;
    }

    return (
        <div className="add-comment">
            <div className="add-comment-content">
                <h2>Add comment</h2>
                <form>
                    <div>
                        <label>Content:</label>
                        <textarea
                            name="content"
                            value={comment.content}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="add-comment-buttons">
                        <button type="submit" onClick={handleSave}>Save</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddComment