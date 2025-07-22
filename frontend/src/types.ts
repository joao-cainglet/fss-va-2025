// src/types.ts
export interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
}


export interface ChatSession {
    id: string;
    title: string;
    date: string;
    intent: string;
}

export interface SessionState {
    sessions: ChatSession[];
    activeSession: string
}
