import React, { useCallback, useEffect, useState } from 'react'
import api from '../api'
import EditPost from './EditPost';
import ConfirmationDialog from './ConfirmationDialog';
import AddPost from './AddPost';
import CommentContainer from './CommentContainer';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../redux/slices/postSlice';

const PostContainer = () => {
    const posts = useSelector((state) => state.post.posts);
    const dispatch = useDispatch();
    const [activeMenu, setActiveMenu] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [postId, setPostId] = useState(null);
    const [isDeletePostOpen, setIsDeletePostOpen] = useState(false);
    const [deletePostId, setDeletePostId] = useState(null);
    const [isAddPostOpen, setIsAddPostOpen] = useState(false);
    const [isPostCommentsOpen, setIsPostCommentsOpen] = useState(false);
    const [isPostsContainerOpen, setIsPostsConatainerOpen] = useState(true);
    const [postCount, setPostCount] = useState(posts.length);
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
        setActiveMenu(null);
        setPostId(postId);
        setIsPostsConatainerOpen(false);
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
        setActiveMenu(null);
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
            await fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
        setIsDeletePostOpen(false);
        setDeletePostId(null);
    };

    const fetchPosts = useCallback(async () => {
        try {
            const response = await api.get('/posts/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            dispatch(getPosts(response.data));
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }, [token]);

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts]); //I used useCallback to remove the warning

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws/posts');
        socket.onopen = () => {
            console.log('WebSocket connection opened');
        };
        socket.onmessage = (e) => {
            const count = parseInt(e.data);
            console.log(e.data)

            if (!isNaN(count)) {
                setPostCount(count);
            } else {
                console.error('Invalid post count received:', e.data);
            }
        };

        socket.onclose = (e) => {
            console.log('WebSocket connection closed:', e.code, e.reason);
        };

        socket.onerror = (e) => {
            console.error('WebSocket error:', e);
        };

        return () => {
            if (socket.readyState === 1) {
                socket.close();
            }
        };
    }, []);


    return (
        <>
            {isPostsContainerOpen && (
                <div className='posts-container'>
                    <div className='posts-container-header'>
                        <h2>Posts</h2>
                        <p>Number of Posts: {postCount}</p>
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
            )}

            {isPostCommentsOpen && (
                <CommentContainer post_id={postId} />
            )}
        </>
    );
};

export default PostContainer;