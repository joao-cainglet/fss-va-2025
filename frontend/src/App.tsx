import ChatPanel from './pages/ChatPanel';
import Layout from './components/Layout';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SearchConvos from './pages/SearchConvos';
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/app" replace />} />
            <Route path="app">
              <Route index element={<ChatPanel />} />
              <Route path=":chatId" element={<ChatPanel />} />
            </Route>
            <Route path="search" element={<SearchConvos />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
