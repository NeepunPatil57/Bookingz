import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/navbar";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:4000/all-places").then((response) => {
      setPlaces(response.data);
    });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-6">
        {places.length > 0 &&
          places.map((place) => (
            <Link 
              to={"/place/"+place._id}
              key={place.id}
              className="mb-2 place-card hover:scale-105 transition-transform duration-300 "
            >
              {place.photos?.[0] && (
                <img
                  src={"http://localhost:4000/uploads/" + place.photos?.[0]}
                  alt="No Image"
                  className="rounded-xl mb-2"
                />
              )}
              <h2 className="text-xl font-bold leading-6">{place.address}</h2>
              <h3 className="text-xl font-semibold truncate leading-6 text-gray-500">
                {place.title}
              </h3>
              <h2 className="text-lg font-bold leading-6">
                {"₹" +
                  (place.price && typeof place.price === "number"
                    ? place.price.toLocaleString()
                    : "N/A")}{" "}
                Per Night
              </h2>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Home;
