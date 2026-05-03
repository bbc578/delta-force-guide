import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MapDetail from './pages/MapDetail';
import Guides from './pages/Guides';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/maps" element={<Home />} />
          <Route path="/maps/:id" element={<MapDetail />} />
          <Route path="/guides" element={<Guides />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
