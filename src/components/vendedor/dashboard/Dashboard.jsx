import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;