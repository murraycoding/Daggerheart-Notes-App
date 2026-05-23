import { useState, useEffect, createContext, useContext } from 'react';
import { api } from '../api/client.js';
 
const CampaignContext = createContext(null);

export function CampaignProvider({ children }) {
  const [campaigns, setCampaigns] = useState([]);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    api.getCampaigns()
      .then(data => {
        setCampaigns(data);
        if (data.length > 0) setActiveCampaign(data[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
 
  return (
    <CampaignContext.Provider value={{ campaigns, setCampaigns, activeCampaign, setActiveCampaign, loading }}>
      {children}
    </CampaignContext.Provider>
  );
}
 
export function useCampaign() {
  return useContext(CampaignContext);
}
