import React from 'react';
import { UserContext } from '../../UserContext';
import { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '../Navbar/navbar';

const Account = () => {
  const { ready,user } = useContext(UserContext);

  if(!ready){
    return 'Loading....'
  }

  if (ready && !user) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Navbar />
      Account Page of {user.name}
    </div>
  );
};

export default Account;
