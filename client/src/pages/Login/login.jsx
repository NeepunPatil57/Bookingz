import React, {useContext} from "react";
import { useState } from "react";
import { Link,Navigate } from "react-router-dom";
import { UserContext} from '../../UserContext';
import axios from "axios";

const Login = () => {
  const { setUser } = useContext(UserContext); 
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [redirect, setredirect] = useState(false);
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response=await axios.post("http://localhost:4000/login",{
        email,
        password,
      });
      setUser(response.data);
      alert("Login successful");
      setredirect(true);
    } catch (e) {
      alert("Login failed");
      console.log(e);
    }
  };
  
  if(redirect){
    return <Navigate to={'/'}/>
  }
  return (
    <div>
      <div className="flex items-center min-h-screen p-4  lg:justify-center ">
        <div className="flex flex-col overflow-hidden  rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md">
          <div className="p-4 py-6 text-white bg-black md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly">
            <div className="my-3 text-4xl font-bold tracking-wider text-center">
              <a href="#">DreamyNest</a>
            </div>
            <p className="mt-6 font-md text-center text-gray-300 md:mt-0">
  Welcome to Dreamy Nest, your ultimate destination for unforgettable vacation home experiences. Explore our handpicked selection of beautiful homes, villas, and cottages in breathtaking locations. Whether you're planning a romantic getaway, a family reunion, or a solo adventure, we have the perfect home for you. Discover your dream vacation today and make memories that will last a lifetime.
</p>

            <p className="mt-6 text-sm text-center text-gray-300">
              Read our{" "}
              <a href="#" className="underline">
                terms
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                conditions
              </a>
            </p>
          </div>
          <div className="p-5 bg-white md:flex-1">
            <h3 className="my-4 text-2xl font-semibold text-gray-700">
              Account Login
            </h3>
            <form className="flex flex-col space-y-5" onSubmit={handleLoginSubmit}>
              <div className="flex flex-col space-y-1">
                <label for="email" className="text-sm font-semibold text-gray-500">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  autoFocus
                  className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    for="password"
                    className="text-sm font-semibold text-gray-500"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:underline focus:text-blue-800"
                  >
                    Forgot Password?
                  </a>
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 transition duration-300 rounded focus:ring-2 focus:ring-offset-0 focus:outline-none focus:ring-blue-200"
                />
                <label
                  for="remember"
                  className="text-sm font-semibold text-gray-500"
                >
                  Remember me
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-black  rounded-md  focus:ring-blue-200 focus:ring-4"
                >
                  Log in
                </button>
              </div>
              <div className="flex flex-col space-y-5">
                <span className="flex items-center justify-center space-x-2">
                  <span className="h-px bg-gray-400 w-14"></span>
                  <span className="h-px bg-gray-400 w-14"></span>
                </span>
                <div className="flex flex-col space-y-4">
                  <Link to={"/register"}>
                    <p className="flex flex-col items-center justify-center mt-10 text-center">
                      <span>Don't have an account?</span>
                    </p>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
