import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/navbar";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [places, setPlaces] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [noPlacesFound, setNoPlacesFound] = useState(false); 
  useEffect(() => {
    axios.get("http://localhost:4000/all-places").then((response) => {
      setPlaces(response.data);
      setIsLoading(false);
    });
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchButtonClick = () => {
    const searchText = searchInput.toLowerCase();
    const filtered = places.filter(
      (place) =>
        place.address.toLowerCase().includes(searchText) ||
        place.title.toLowerCase().includes(searchText)
    );

    if (filtered.length === 0) {
      setNoPlacesFound(true); 
    } else {
      setNoPlacesFound(false);
    }

    setFilteredPlaces(filtered);
  };

  return (
    <div>
      <Navbar />
      <div className="mx-80 mt-0 w-1/2 relative bottom-20 px-14">
        <div className="relative">
          <input
            type="text"
            placeholder="Search places..."
            value={searchInput}
            onChange={handleSearchInputChange}
            className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.0}
            stroke="currentColor"
            className="w-8 h-8 absolute top-1/2 transform -translate-y-1/2 right-2 cursor-pointer"
            onClick={handleSearchButtonClick}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
      </div>

      <div className="mt-0">
        {isLoading ? (
          <p>Loading...</p>
        ) : noPlacesFound ? (
          <p className="text-2xl font-semibold px-7">No places found matching your search.</p>
        ) : filteredPlaces.length > 0 ? (
          <div className="grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-6">
            {filteredPlaces.map((place) => (
              <Link
                to={"/place/" + place._id}
                key={place.id}
                className="mb-2 place-card hover:scale-105 transition-transform duration-300"
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
        ) : (
          <div className="grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-6">
            {places.map((place) => (
              <Link
                to={"/place/" + place._id}
                key={place.id}
                className="mb-2 place-card hover:scale-105 transition-transform duration-300"
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
        )}
      </div>
    </div>
  );
};

export default Home;
