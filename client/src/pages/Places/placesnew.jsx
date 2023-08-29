import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/navbar";
import { Link, useLocation, Navigate, useParams } from "react-router-dom";
import AccountNav from "../Account/accoutnav";
import { UserContext } from "../../UserContext";
import { useContext } from "react";
import Perks from "../../perks";
import axios from "axios";

const Placesnew = () => {
  const { id } = useParams();
  console.log("id: places form page", { id });
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
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("http://localhost:4000/places/" + id).then((response) => {
      const { data } = response;
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
  }, [id]);

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
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    };
    if (id) {
      //update
      await axios.put("http://localhost:4000/places", {
        id,
        ...placeData,
      });
    } else {
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
    setRedirect("/account/places");
  };

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  const removePhoto = (filename, e) => {
    e.preventDefault();
    const updatedPhotos = addedPhotos.filter((photo) => photo !== filename);
    setAddedPhotos(updatedPhotos);
  };

  const selectAsMainPhoto = (filename, e) => {
    e.preventDefault();
    const updatedPhotos = addedPhotos.filter((photo) => photo !== filename);
    const newPhotosOrder = [filename, ...updatedPhotos];
    setAddedPhotos(newPhotosOrder);
  };

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
                  <div className="py-2 px-2 h-40 flex relative" key={index}>
                    <img
                      className="rounded-2xl w-full object-cover"
                      src={"http://localhost:4000/uploads/" + link}
                      alt="No Image"
                    ></img>
                    <button
                      onClick={(e) => removePhoto(link, e)}
                      className="absolute bottom-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded-xl cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-7 h-7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => selectAsMainPhoto(link, e)}
                      className="cursor-pointer absolute bottom-2 left-2 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-2"
                    >
                      {link === addedPhotos[0] && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="yellow"
                          className="w-6 h-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {link !== addedPhotos[0] && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                          />
                        </svg>
                      )}
                    </button>
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
