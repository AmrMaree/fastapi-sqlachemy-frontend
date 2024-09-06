import { configureStore } from '@reduxjs/toolkit';
import postReducer from './slices/postSlice'

const store = configureStore({
    reducer: {
        post: postReducer,
    },
});

export default store;
