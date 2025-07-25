// src/components/ChatPanel.tsx
import React, {
  useState,
  useRef,
  useEffect,
  use,
  useLayoutEffect,
} from 'react';
import ChatHistory from '../components/ChatHistory';
import PromptInput from '../components/PromptInput';
import type { Message } from '../types';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import client from '../api/client';
import {
  fetchAllSessionsThunk,
  setCurrentSession,
} from '../store/SessionSlice';
import { useAppDispatch } from '../store';
import ConfirmNewChatDialog from '../components/ConfirmNewChatDialog';

const MOCK_AUTH_TOKEN = 'dummy-secret-token-for-dev';
const THROTTLE_INTERVAL_MS = 50;

function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingResponse, setStreamingResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { chatId } = useParams<{ chatId: string }>();
  const [sessionId, setSessionId] = useState<string | null>(chatId || null);
  const chunkBuffer = useRef<string>('');
  const [intent, setIntent] = useState<string>('Regulatory');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [nextIntent, setNextIntent] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleIntentChange = (newIntent: string) => {
    // If the intent is already active, do nothing
    if (newIntent === intent) return;

    // If we are in an existing chat, show the confirmation dialog
    if (sessionId) {
      setNextIntent(newIntent);
      setIsAlertOpen(true);
    } else {
      // If it's a new chat, just switch the intent directly
      setIntent(newIntent);
    }
  };

  const handleConfirmNewChat = () => {
    if (nextIntent) {
      setIntent(nextIntent); // Set the new intent
      setSessionId(null); // Clear the session ID
      setMessages([]); // Clear old messages
      dispatch(setCurrentSession('')); // Clear active session in Redux
      navigate('/app'); // Navigate to the new chat URL
    }
    setIsAlertOpen(false); // Close the dialog
  };

  useEffect(() => {
    if (isLoading) {
      // Start a timer that runs every 100ms
      const intervalId = setInterval(() => {
        // If the buffer has content, flush it to the state
        if (chunkBuffer.current.length > 0) {
          setStreamingResponse((prev) => prev + chunkBuffer.current);
          chunkBuffer.current = ''; // Clear the buffer
        }
      }, THROTTLE_INTERVAL_MS);

      // This cleanup function is crucial. It stops the timer when the stream ends.
      return () => clearInterval(intervalId);
    }
  }, [isLoading]);

  const handleSendMessage = async (query: string, _intent?: string) => {
    if (!query || isLoading) return;

    setIsLoading(true);
    setStreamingResponse('');
    setError(null);
    const userMessage: Message = {
      content: query,
      role: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);

    let fullResponse = '';
    let currentSessionId = sessionId;
    try {
      if (!currentSessionId) {
        const response = await client.post('/sessions', {
          title: query,
          intent: _intent || intent,
        });
        const newId = response.data.id;

        setSessionId(newId);
        currentSessionId = newId;

        navigate(`/app/${newId}`, { replace: true });
        dispatch(setCurrentSession(newId));
        dispatch(fetchAllSessionsThunk());
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/regulatory-data/${currentSessionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${MOCK_AUTH_TOKEN}`,
          },
          body: JSON.stringify({ query }),
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Failed to get readable stream.');

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (chunkBuffer.current.length > 0) {
            setStreamingResponse((prev) => prev + chunkBuffer.current);
            chunkBuffer.current = '';
          }

          const botMessage: Message = {
            role: 'assistant',
            content: fullResponse,
          };
          setMessages((prev) => [...prev, botMessage]);
          setStreamingResponse('');
          break;
        }
        const chunk = decoder.decode(value, { stream: true });

        chunkBuffer.current += chunk;
        fullResponse += chunk;
      }
    } catch (err: any) {
      setError(`Failed to fetch response: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string, intent: string) => {
    setIntent(intent);
    handleSendMessage(suggestion, intent);
  };

  const fetchMessages = async () => {
    if (!sessionId) return;
    try {
      const response = await client.get(`/sessions/${sessionId}`);
      if (response.data && response.data.messages) {
        setMessages(response.data.messages);
        setIntent(response.data.intent);
        dispatch(setCurrentSession(sessionId));
      } else {
        console.error('No messages found for this session.');
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  useEffect(() => {
    const chatId = window.location.pathname.split('/').pop();
    if (chatId && chatId !== 'app') {
      setSessionId(chatId);
    } else setSessionId(null);
  }, [window.location.pathname]);

  useEffect(() => {
    if (sessionId && !isLoading) {
      fetchMessages();
    }
    if (!sessionId) {
      setMessages([]);
      setIntent('Regulatory');
    }
  }, [sessionId]);

  return (
    <div className="relative flex flex-col h-screen justify-between">
      <ChatHistory
        isLoading={isLoading}
        messages={messages}
        streamingResponse={streamingResponse}
        onSuggestionClick={handleSuggestionClick}
      />
      <PromptInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        currentIntent={intent}
        onIntentChange={handleIntentChange}
      />
      <ConfirmNewChatDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleConfirmNewChat}
      />
    </div>
  );
}

export default ChatPanel;
