import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import { CampaignProvider } from '../hooks/useCampaign.jsx';
 
export default function AppShell() {
  return (
    <CampaignProvider>
      <div className="app-shell">
        <Sidebar />
        <main className="main-panel">
          <Outlet />
        </main>
      </div>
    </CampaignProvider>
  );
}
