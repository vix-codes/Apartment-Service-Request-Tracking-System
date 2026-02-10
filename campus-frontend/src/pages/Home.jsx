
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  return null; // Render nothing, as the redirect will happen immediately
};

export default Home;
