import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import themeReducer from './slices/themeSlice';
import categoryReducer from './slices/categorySlice';
import tagReducer from './slices/tagSlice';
import techStackReducer from './slices/techStackSlice';
import thoughtReducer from './slices/thoughtSlice';

// 配置Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    theme: themeReducer,
    category: categoryReducer,
    tag: tagReducer,
    techStack: techStackReducer,
    thought: thoughtReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// 导出类型定义
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;