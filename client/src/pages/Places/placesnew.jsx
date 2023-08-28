import React, { useState,useEffect } from "react";
import Navbar from "../Navbar/navbar";
import { Link, useLocation,Navigate,useParams } from "react-router-dom";
import AccountNav from "../Account/accoutnav";
import { UserContext } from "../../UserContext";
import { useContext } from "react";
import Perks from "../../perks";
import axios from "axios";

const Placesnew = () => {
  const {id}=useParams();
  console.log("id: places form page",{id});
  const { user } = useContext(UserContext);
  const [selected, setSelected] = useState([]);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [photoLink, setPhotoLink] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);
  useEffect(()=>{
    if(!id){
      return;
    }
    axios.get('http://localhost:4000/places/'+id).then(response=>{
      const {data}=response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
    });
  },[id]);

  const onChange = (newSelected) => {
    setSelected(newSelected);
  };
  function handleCbClick(ev) {
    const { checked, name } = ev.target;
    if (checked) {
      onChange([...selected, name]);
    } else {
      onChange([...selected.filter((selectedName) => selectedName !== name)]);
    }
  }

  const uploadfromdevice = (e) => {
    const files = e.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("http://localhost:4000/upload-from-device", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        setAddedPhotos((prev) => {
          return [...prev, ...filenames];
        });
      });
  };

  async function addPhotoByLink(ev) {
    ev.preventDefault();
    try {
      const { data: filename } = await axios.post(
        "http://localhost:4000/upload-by-link",
        { link: photoLink }
      );
      setAddedPhotos((prev) => {
        return [...prev, filename];
      });
      setPhotoLink("");
    } catch (error) {
      console.error("Error adding photo by link:", error);
    }
  }

  const addPlaces = async (e) => {
    e.preventDefault();
    const placeData={
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
    }
    if(id){
      //update
      await axios.put("http://localhost:4000/places", {
        id,
        ...placeData
      });
    }
    else{
      await axios.post("http://localhost:4000/places", {
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
      });
    }
    setRedirect('/account/places')
  };

  if (redirect) {
    return <Navigate to={'/account/places'} />
  }

  return (
    <div className="px-4">
      <Navbar />
      <AccountNav />
      <span className="font-semibold text-3xl mb-4 ">Details</span>
      <div className="py-5">
        <div className="p-4 rounded-lg shadow-md  ring-2 ring-gray-300">
          <form className="w-md" onSubmit={addPlaces}>
            <h2 className="font-semibold text-2xl">Title</h2>
            <p className="text-grey-500">Title for Your Appartment</p>
            <input
              className="w-full font-semibold text-lg px-2 py-2 rounded-lg  focus:border-black"
              type="text"
              placeholder="Title,for example my Apartment"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
            />
            <h2 className="font-semibold text-2xl">Address</h2>
            <p className="text-grey-500">Address for Your Appartment</p>
            <input
              className="w-full font-semibold text-lg px-2 py-2 rounded-lg  focus:border-black"
              type="text"
              placeholder="Title,for example my Apartment"
              value={address}
              onChange={(ev) => setAddress(ev.target.value)}
            />
            <h2 className="font-semibold text-2xl">Photos</h2>
            <p className="text-grey-500">More are Better</p>
            <div>
              <input
                type="text"
                placeholder="Add Using Link...."
                value={photoLink}
                onChange={(ev) => setPhotoLink(ev.target.value)}
                className="w-full font-semibold text-lg px-2 py-2 rounded-lg  focus:border-black"
              ></input>

              <button
                onClick={addPhotoByLink}
                className="bg-cyan-300 rounded-2xl py-6 px-4 font-semibold text-black flex items-center gap-2 text-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                  />
                </svg>
                Add Photo
              </button>
            </div>
            <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {addedPhotos.length > 0 &&
                addedPhotos.map((link, index) => (
                  <div className="py-2 px-2 h-40 flex " key={index}>
                    <img
                      className="rounded-2xl w-full object-cover"
                      src={"http://localhost:4000/uploads/" + link}
                      alt="No Image"
                    ></img>
                  </div>
                ))}
              <label className="bg-cyan-300 h-40 cursor-pointer border font-semibold rounded-2xl p-8 text-md text-black flex items-center">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={uploadfromdevice}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                Upload From Your Device (.jpeg , .png)
              </label>
            </div>
            <h2 className="font-semibold text-2xl">Description</h2>
            <p className="text-grey-500">Description </p>
            <textarea
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            />
            <h2 className="font-semibold text-2xl">Perks</h2>
            <p className="text-grey-500">Select All Perks of Your Place</p>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 lg:sm:grid-cols-6  gap-4">
              <Perks selected={perks} onChange={setPerks} />
            </div>
            <h2 className="font-semibold text-2xl">Extra Information</h2>
            <p className="text-grey-500">Apartment Rules</p> extraInfo
            <textarea
              value={extraInfo}
              onChange={(ev) => setExtraInfo(ev.target.value)}
            />
            <div className="grid sm:grid-cols-3 gap-2">
              <div>
                <h2 className="font-semibold text-2xl">Check In Time</h2>
                <p className="text-grey-500">Add Check In Time of Your Place</p>
                <input
                  type="text"
                  placeholder="14:00"
                  value={checkIn}
                  onChange={(ev) => setCheckIn(ev.target.value)}
                />
              </div>
              <div>
                <h2 className="font-semibold text-2xl">Check Out Time</h2>
                <p className="text-grey-500">
                  Add Check Out Time of Your Place
                </p>
                <input
                  type="text"
                  placeholder="11:00"
                  value={checkOut}
                  onChange={(ev) => setCheckOut(ev.target.value)}
                />
              </div>
              <div>
                <h2 className="font-semibold text-2xl">Max Number of Guests</h2>
                <p className="text-grey-500">
                  Add Max no of Guests in Your Place
                </p>
                <input
                  type="number"
                  placeholder="4"
                  value={maxGuests}
                  onChange={(ev) => setMaxGuests(ev.target.value)}
                />
              </div>
            </div>
            <div>
              <button className="bg-cyan-300 rounded-2xl w-full my-6 py-6 px-4 font-semibold text-black flex items-center gap-2 justify-center text-2xl">
                Save All Your Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Placesnew;
