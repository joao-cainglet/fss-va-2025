import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SearchConvos from './pages/SearchConvos';
import { Provider } from 'react-redux';
import store from './store';
import { ThemeProvider } from './themes/ThemeProvider';
import ChatPanel from './pages/ChatPanel';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './api/msalConfig';
import AuthGuard from './components/AuthGuard';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Provider store={store}>
      <MsalProvider instance={msalInstance}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AuthGuard />} />
              <Route element={<RequireAuth />}>
                <Route path="/app" element={<ChatPanel />} />
                <Route path="/app/:chatId" element={<ChatPanel />} />
                <Route path="/search" element={<SearchConvos />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </MsalProvider>
    </Provider>
  );
}

export default App;
