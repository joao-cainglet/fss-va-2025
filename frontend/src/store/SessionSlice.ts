import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ChatSession, SessionState } from '../types';
import client from '../api/client';


const initialState: SessionState = {
    sessions: [],
    activeSession: "",
};

export const fetchAllSessionsThunk = createAsyncThunk(
    'session/fetchAllSessions',
    async () => {
        const response = await client.get('/sessions');
        return response.data as ChatSession[];
    }
);

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setCurrentSession: (state: SessionState, action: PayloadAction<string>) => {
            state.activeSession = action.payload;
        },
        removeSession: (state: SessionState, action: PayloadAction<string>) => {
            state.sessions = state.sessions.filter(session => session.id !== action.payload);
            if (state.activeSession === action.payload) {
                state.activeSession = "";
            }
        },
        updateSession: (state: SessionState, action: PayloadAction<ChatSession>) => {
            const index = state.sessions.findIndex(session => session.id === action.payload.id);
            if (index !== -1) {
                state.sessions[index] = action.payload;
                if (state.activeSession === action.payload.id) {
                    state.activeSession = action.payload.id;
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllSessionsThunk.pending, (state) => {
                // Optional: Add loading state handling here
            })
            .addCase(fetchAllSessionsThunk.fulfilled, (state, action) => {
                state.sessions = action.payload;
            })
            .addCase(fetchAllSessionsThunk.rejected, (state, action) => {
                // Optional: Add error state handling here
                console.error('Failed to fetch sessions:', action.error);
            });
    },
});

export const { setCurrentSession, removeSession, updateSession } = sessionSlice.actions;
export default sessionSlice.reducer;