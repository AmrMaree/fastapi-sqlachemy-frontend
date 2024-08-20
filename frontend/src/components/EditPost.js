import React, { useState, useEffect } from 'react'
import api from '../api'

const EditPost = ({ post_id, onSave, onClose }) => {
    const [post, setPost] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/posts/${post_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Fetched post data:', response.data);
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPost();
    }, [token, post_id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPost({
            ...post,
            [name]: value
        });
    };

    const handleSave = async () => {
        try {
            const response = await api.put(`/posts/${post_id}`, post, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Post updated successfully:', response.data);
            if (onSave) onSave();
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div className="edit-post">
            <div className="edit-post-content">
                <h2>Edit Post</h2>
                <form>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={post.title || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Content:</label>
                        <textarea
                            name="content"
                            value={post.content || ''}
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

export default EditPost