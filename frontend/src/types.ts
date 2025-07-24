// src/types.ts
export interface Message {
    role: 'user' | 'assistant';
    content: string;
}


export interface ChatSession {
    id: string;
    title: string;
    created_at: string;
    intent: string;
}

export interface SessionState {
    sessions: ChatSession[];
    activeSession: string
}
