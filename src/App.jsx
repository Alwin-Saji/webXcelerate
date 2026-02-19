import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Chatbot from './components/Chatbot';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CityMap from './pages/CityMap';
import Transport from './pages/Transport';
import Waste from './pages/Waste';
import Energy from './pages/Energy';
import Citizens from './pages/Citizens';
import { notifications } from './data/mockData';
import styles from './App.module.css';

/* Inner dashboard layout with sidebar + header */
function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentRole, setCurrentRole] = useState('admin');
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={styles.layout}>
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        unreadCount={unreadCount}
      />
      <div className={styles.mainWrapper}>
        <Header currentRole={currentRole} setCurrentRole={setCurrentRole} />
        <main className={styles.content}>
          <Routes>
            <Route path="/" element={<Dashboard currentRole={currentRole} />} />
            <Route path="/map" element={<CityMap />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="/waste" element={<Waste />} />
            <Route path="/energy" element={<Energy />} />
            <Route path="/citizens" element={<Citizens />} />
          </Routes>
        </main>
      </div>
      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard/*" element={<DashboardLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
