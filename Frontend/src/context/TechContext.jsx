// context/TechContext.js
import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const TechContext = createContext();

export const TechProvider = ({ children }) => {
  const [devices, setDevices] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
    checkAuthStatus();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await api.get('/devices');
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  
  return (
    <TechContext.Provider value={{ devices, user, isLoading, handleDonation }}>
      {children}
    </TechContext.Provider>
  );
};

export default TechContext;