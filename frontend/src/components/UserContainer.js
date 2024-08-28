import React, { useEffect, useState } from 'react'
import api from '../api'
import EditPost from './EditPost';
import ConfirmationDialog from './ConfirmationDialog';
import AddPost from './AddPost';
import CommentContainer from './CommentContainer';

const UserContainer = () => {
    const [posts, setPosts] = useState([]);
    const [activeMenu, setActiveMenu] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [postId, setPostId] = useState(null);
    const [isDeletePostOpen, setIsDeletePostOpen] = useState(false);
    const [deletePostId, setDeletePostId] = useState(null);
    const [isAddPostOpen, setIsAddPostOpen] = useState(false);
    const [isPostCommentsOpen, setIsPostCommentsOpen] = useState(false);
    const [isUserContainerVisible, setIsUserContainerVisible] = useState(true);
    const token = localStorage.getItem('token');

    const toggleMenu = (postId) => {
        setActiveMenu(activeMenu === postId ? null : postId);
    };

    const openEditPost = (postId) => {
        setIsEditOpen(true);
        setActiveMenu(null);
        setPostId(postId);
    };

    const closeEditPost = () => {
        setIsEditOpen(false);
        setPostId(null);
    };

    const openPostComments = (postId) => {
        setIsPostCommentsOpen(true);
        setIsUserContainerVisible(false);
        setActiveMenu(null);
        setPostId(postId);
    }

    const handleSave = async () => {
        await fetchPosts();
        closeEditPost();
    };

    const openConfirmationDialog = (postId) => {
        setDeletePostId(postId);
        setIsDeletePostOpen(true);
        setActiveMenu(null);
    };

    const handleOpenAddPost = () => {
        setIsAddPostOpen(true);
    }

    const handleCloseAddPost = () => {
        setIsAddPostOpen(false);
    }

    const handleDelete = async () => {
        try {
            const response = await api.delete(`/posts/${deletePostId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data)
            await fetchPosts();  // Refresh posts list after deletion
        } catch (error) {
            console.error('Error deleting post:', error);
        }
        setIsDeletePostOpen(false);
        setDeletePostId(null);
    };

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

    useEffect(() => {
        fetchPosts();
    }, [token]);

    return (
        <>
            <div className='posts-container'>
                <div className='posts-container-header'>
                    <h2>Posts</h2>
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
                        post_id={postId}
                        onClose={closeEditPost}
                        onSave={handleSave}
                    />
                )}

                {isDeletePostOpen && (
                    <ConfirmationDialog
                        message="Are you sure you want to delete this post?"
                        onConfirm={handleDelete}
                        onCancel={() => setIsDeletePostOpen(false)}
                    />
                )}

                {isAddPostOpen && (
                    <AddPost
                        onClose={handleCloseAddPost}
                        onSave={handleSave}
                    />
                )}
            </div>

            {isPostCommentsOpen && (
                <CommentContainer post_id={postId} />
            )}
        </>
    );
};

export default UserContainer;