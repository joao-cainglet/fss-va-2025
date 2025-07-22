import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ChatSession, SessionState } from '../types';


const recentSearches: ChatSession[] = [
    { id: '1', title: 'Initial Greeting and Assistance Offered', date: 'Today', intent: 'regulatory' },
    { id: '2', title: 'Simple Greeting and Response', date: 'Today', intent: 'regulatory' },
    {
        id: '3',
        title: 'FastAPI and Azure Cosmos DB Integration',
        date: 'Yesterday',
        intent: 'speech'
    },
    { id: '4', title: 'React Code Generation Agent Methods', date: 'Jul 16', intent: 'internal' },
];

const initialState: SessionState = {
    sessions: recentSearches,
    activeSession: "",
};

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        addSession: (state: SessionState, action: PayloadAction<ChatSession>) => {
            state.sessions.push(action.payload);
        },
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
});

export const { addSession, setCurrentSession, removeSession, updateSession } = sessionSlice.actions;
export default sessionSlice.reducer;