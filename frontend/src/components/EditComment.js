import React, { useState, useEffect } from 'react';
import api from '../api';

const EditComment = ({ comment_id, onSave, onClose }) => {
    const [comment, setComment] = useState();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/comments/${comment_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Fetched comment data:', response.data);
                setComment(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchPost();
    }, [token, comment_id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setComment({
            ...comment,
            [name]: value
        });
    };

    const handleSave = async () => {
        try {
            const response = await api.put(`/comments/${comment_id}`, comment, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Comment updated successfully:', response.data);
            if (onSave) onSave();
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    if (!comment) {
        return <div>Loading...</div>;
    }

    return (
        <div className="edit-comment">
            <div className="edit-comment-content">
                <h2>Edit Comment</h2>
                <form>
                    <div>
                        <label>Content:</label>
                        <textarea
                            name="content"
                            value={comment.content}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="edit-comment-buttons">
                        <button type="button" onClick={handleSave}>Save</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditComment