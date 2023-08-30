import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/navbar";

const PlacePage = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`http://localhost:4000/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]);

  if (!place) return "";
  return (
    <div>
      <Navbar />
      <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
        <h1 className="text-2xl font-semibold">{place.title}</h1>
        <a className="text-xl font-semibold block underline" target="_blank" href={'https://maps.google.com/?q='+place.address}>{place.address}</a>
        <h2 className="text-lg font-bold leading-6">
                {"₹" +
                  (place.price && typeof place.price === "number"
                    ? place.price.toLocaleString()
                    : "N/A")}{" "}
                Per Night
              </h2>
        <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
          <div>
            <div className="my-4">
              <h2 className="font-semibold text-2xl">Description</h2>
              {place.description}
            </div>
            
              
          
            Check-in: {place.checkIn}
            <br />
            Check-out: {place.checkOut}
            <br />
            Max number of guests: {place.maxGuests}
          </div>
        </div>
        <div className="bg-white -mx-8 px-8 py-8 border-t">
          <div>
            <h2 className="font-semibold text-2xl">Extra info</h2>
          </div>
          <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
            {place.extraInfo}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacePage;
