import ChatPanel from './pages/ChatPanel';
import Layout from './components/Layout';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SearchConvos from './pages/SearchConvos';

function App() {
  return (
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
  );
}

export default App;
