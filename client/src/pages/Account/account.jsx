import React, { useState } from 'react';
import { UserContext } from '../../UserContext';
import { useContext } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar/navbar';
import './account.css';
import axios from 'axios';
import Places from '../Places/places';
import AccountNav from './accoutnav';

const Account = () => {
  const { ready, user, setUser } = useContext(UserContext);
  const [tohome, settohome] = useState(false);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  const logout = async () => {
    await axios.post("http://localhost:4000/logout");
    setUser(null);
    settohome('/');
  };


  if (!ready) {
    return 'Loading....'
  }

  if (ready && !user && !tohome) {
    return <Navigate to="/login" />;
  }

  if (tohome) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Navbar />
      <AccountNav />
      {subpage === 'profile' && (
        <div className='py-5 px-60'>
          <h3 className='user_welcome'>Welcome... {user.name}</h3>
          <div className='profile'>
            <span className='profile_heading'>Profile</span>
            <div className='profile-photo'>
              Profile Photo
            </div>
            <span className='profile-info'>Username: {user.name}</span><br />
            <span className='profile-info'>Email: {user.email}</span>
            <div>
              <h2 className='logout'>You are currently Logged in as {user.name} email: {user.email}</h2>
              <body>
                <button class=" button logout-button" onClick={logout}>Logout</button>
              </body>
            </div>
          </div>
        </div>
      )}
      {subpage === 'places' && (
        <Places/>
      )}
    </div>
  );
};

export default Account;
