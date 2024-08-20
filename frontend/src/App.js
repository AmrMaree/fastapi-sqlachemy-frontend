import React, { useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const switchToSignup = () => setCurrentPage('signup');
  const switchToLogin = () => setCurrentPage('login');
  const handleSuccessfulLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  if (isLoggedIn) {
    return <Home />;
  }

  return (
    <div>
      {currentPage === 'login' ? (
        <Login onSwitchToSignup={switchToSignup} onSuccessfulLogin={handleSuccessfulLogin} />
      ) : (
        <Signup onSwitchToLogin={switchToLogin} onSuccessfulSignup={switchToLogin} />
      )}
    </div>
  );
};

export default App;