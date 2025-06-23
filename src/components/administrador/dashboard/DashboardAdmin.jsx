import React from "react";
import { Link, Outlet } from "react-router-dom";
import SidebarAdmin from './sidebar/SidebarAdmin';


const DashboardAdmin = () => {
  return (
    <div className="dashboard-container">
      <SidebarAdmin />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardAdmin;
