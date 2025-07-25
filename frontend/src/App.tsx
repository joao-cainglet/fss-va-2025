import Layout from './components/Layout';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SearchConvos from './pages/SearchConvos';
import { Provider } from 'react-redux';
import store from './store';
import { ThemeProvider } from './themes/ThemeProvider';
import ChatPanel from './pages/ChatPanel';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<Navigate to="/app" replace />} />
              <Route element={<Layout></Layout>}>
                <Route path="app">
                  <Route index element={<ChatPanel />} />
                  <Route path=":chatId" element={<ChatPanel />} />
                </Route>
                <Route path="search" element={<SearchConvos />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
