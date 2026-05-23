import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import CampaignHome from './pages/CampaignHome.jsx';
import EntityList from './pages/EntityList.jsx';
import EntityDetail from './pages/EntityDetail.jsx';
 
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/campaigns" replace />} />
        <Route path="campaigns" element={<CampaignHome />} />
        <Route path=":campaign/:type" element={<EntityList />} />
        <Route path=":campaign/:type/:slug" element={<EntityDetail />} />
      </Route>
    </Routes>
  );
}
