import Home from '../src/pages/Home/home'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from '../src/pages/Login/login';
import Register from '../src/pages/Register/register';
import Account from '../src/pages/Account/account';
import axios from 'axios';
import { UserContextProvider } from './UserContext';
import Places from './pages/Places/places';
import Placesnew from './pages/Places/placesnew';
axios.defaults.withCredentials=true;
const App=()=>{
  return (
    <UserContextProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/places" element={<Places />} />
        <Route path="/account/places/new" element={<Placesnew/>}/>
        </Routes>
      </Router>
    </UserContextProvider>
  );
}
export default App;
