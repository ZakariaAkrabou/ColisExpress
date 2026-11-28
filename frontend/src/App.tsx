import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { TrackingPage } from './pages/TrackingPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TrackingPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
