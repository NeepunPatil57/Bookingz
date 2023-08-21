import Home from '../src/pages/Home/home'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from '../src/pages/Login/login';
import Register from '../src/pages/Register/register';
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
export default App;
