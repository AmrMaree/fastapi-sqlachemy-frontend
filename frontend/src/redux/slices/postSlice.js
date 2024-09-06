import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
    name: 'post',
    initialState: {
        posts: [],
    },
    reducers: {
        addPost: (state, action) => {
            state.posts.push(action.payload);
        },
        deletePost: (state, action) => {
            state.posts = state.posts.filter((post) => post.id !== action.payload);
        },
        getPosts: (state, action) => {
            state.posts = action.payload;
        },
    },
});

export const { addPost, deletePost, getPosts } = postSlice.actions;
export default postSlice.reducer;
