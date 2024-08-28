import React, { useEffect, useState } from 'react';
import api from '../api';
import EditComment from './EditComment.js';
import ConfirmationDialog from './ConfirmationDialog';
import AddComment from "./AddComment";

const CommentContainer = ({ post_id }) => {
    const [comments, setComments] = useState([]);
    const [activeMenu, setActiveMenu] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [commentId, setCommentId] = useState(null);
    const [isDeleteCommentOpen, setIsDeleteCommentOpen] = useState(false);
    const [deleteCommentId, setDeleteCommentId] = useState(null);
    const [isAddCommentOpen, setIsAddCommentOpen] = useState(false);
    // const [isCommentContainerVisible, setIsCommentContainerVisible] = useState(true);
    const token = localStorage.getItem('token');

    const toggleMenu = (commentId) => {
        setActiveMenu(activeMenu === commentId ? null : commentId);
    };

    const openEditComment = (commentId) => {
        setIsEditOpen(true);
        setActiveMenu(null);
        setCommentId(commentId);
    };

    const closeEditComment = () => {
        setIsEditOpen(false);
        setCommentId(null);
    };

    const handleSave = async () => {
        await fetchComments();
        closeEditComment();
    };

    const openConfirmationDialog = (commentId) => {
        setDeleteCommentId(commentId);
        setIsDeleteCommentOpen(true);
        setActiveMenu(null);
    };

    const handleOpenAddComment = () => {
        setIsAddCommentOpen(true);
    }

    const handleCloseAddComment = () => {
        setIsAddCommentOpen(false);
    }

    const handleDelete = async () => {
        try {
            const response = await api.delete(`/comments/${deleteCommentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data)
            await fetchComments();  // Refresh Comments list after deletion
        } catch (error) {
            console.error('Error deleting Comment:', error);
        }
        setIsDeleteCommentOpen(false);
        setDeleteCommentId(null);
    };

    const fetchComments = async () => {
        try {
            const response = await api.get(`/posts/${post_id}/comments`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching Comments:', error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [token]);

    return (
        <div className='comments-container'>
            <div className='comments-container-header'>
                <h2>Comments</h2>
                <button type='button' onClick={handleOpenAddComment}>Add comment</button>
            </div>
            <table border='1'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>PostID</th>
                        <th>UserID</th>
                        <th>Content</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {comments.map((comment) => (
                        <tr key={comment.id}>
                            <td>{comment.id}</td>
                            <td>{comment.post_id}</td>
                            <td>{comment.user_id}</td>
                            <td>{comment.content}</td>
                            <td>
                                <div className="settings-container">
                                    <span className="settings-icon" onClick={() => toggleMenu(comment.id)}>
                                        ...
                                    </span>
                                    {activeMenu === comment.id && (
                                        <div className="settings-menu">
                                            <div className="settings-item" onClick={() => openEditComment(comment.id)}>Edit</div>
                                            <div className="settings-item" onClick={() => openConfirmationDialog(comment.id)}>Delete</div>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isEditOpen && (
                <EditComment
                    comment_id={commentId}
                    onClose={closeEditComment}
                    onSave={handleSave}
                />
            )}

            {isDeleteCommentOpen && (
                <ConfirmationDialog
                    message="Are you sure you want to delete this comment?"
                    onConfirm={handleDelete}
                    onCancel={() => setIsDeleteCommentOpen(false)}
                />
            )}

            {isAddCommentOpen && (
                <AddComment
                    post_id={post_id}
                    onClose={handleCloseAddComment}
                    onSave={handleSave}
                />
            )}
        </div>
    )
}

export default CommentContainer