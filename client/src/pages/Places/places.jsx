import React, { useEffect,useState } from "react";
import Navbar from "../Navbar/navbar";
import { Link, useLocation,useParams } from "react-router-dom";
import AccountNav from '../Account/accoutnav';
import axios from 'axios';
const Places = () => {
  const[places,setPlaces]=useState([]);
  const {id}=useParams();
  console.log("id: main page",{id});
  useEffect(()=>{
    axios.get('http://localhost:4000/places').then(({data})=>{
      setPlaces(data)
  
    });
  },[])
  return (
    <div className="">
      <Navbar />
      <AccountNav/>
      My Places
      <div className="text-center">
          <Link className="inline-flex gap-1 bg-cyan-300 text-black font-semibold py-2 px-6 rounded-full" to={'/account/places/new'}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            Add new place
          </Link>
        </div> 
        <div className="mt-4">
          {places.length > 0 && places.map(place=>(
            <Link to={"/account/places/"+place._id} className="bg-gray-200 mb-4 p-4 rounded-2xl flex gap-4 shink-0 cursor-pointer">
              <div className="flex w-32 h-32 bg-gray-500 ">
                {place.photos.length && (
                  <img className="object-cover" src={'http://localhost:4000/uploads/'+place.photos[0]} alt="No Image"/>
                )}
              </div>
              <div className="grow-0 shink">
              <h2 className="font-semibold text-2xl">{place.title}</h2>
                <h2 className="font-semibold text-xl mt-2">{place.description}</h2>
              </div>
            </Link>
          ))}
        </div>
   </div>
  );
};

export default Places;
