import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ResPageStep1 from './pages/RegPageStep1';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register/step1" element={<ResPageStep1 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
