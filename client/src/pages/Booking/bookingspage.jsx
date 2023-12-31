import { useParams } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../UserContext";
import AccountNav from "../Account/accoutnav";
import Navbar from "../Navbar/navbar";
import axios from "axios";
import PlaceGallery from "./placegallery";
import { differenceInCalendarDays, format } from "date-fns";

const Bookingspage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState("");
  useEffect(() => {
    if (id) {
      axios.get("http://localhost:4000/bookings").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return "";
  }
  return (
    <div className="my-2 px-6">
      <Navbar />
      <AccountNav />
      <div className="my-4">
        <h1 className="text-3xl font-semibold">{booking.place.title}</h1>
        <a
          className="my-2 text-2xl font-semibold block underline mb-6"
          target="_blank"
          href={"https://maps.google.com/?q=" + booking.place.address}
        >
          {booking.place.address}
        </a>
        <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-4 font-semibold">Your booking information:</h2>
            <div className={"flex gap-1 mb-2 mt-4 text-gray-500 text-xl"}>
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
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
              {differenceInCalendarDays(
                new Date(booking.checkOut),
                new Date(booking.checkIn)
              )}{" "}
              nights:
              <div className="flex gap-1 items-center ml-2">
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
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                  />
                </svg>
                {format(new Date(booking.checkIn), "yyyy-MM-dd")}
              </div>
              &rarr;
              <div className="flex gap-1 items-center">
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
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                  />
                </svg>
                {format(new Date(booking.checkOut), "yyyy-MM-dd")}
              </div>
            </div>
          </div>
          <div className="bg-primary p-6 text-black rounded-2xl">
            <div>Total price</div>
            <div className="text-3xl">
            {"₹" +
            (booking.price && typeof booking.price === "number"
              ? booking.price.toLocaleString()
              : "N/A")}{" "}
            </div>
          </div>
        </div>
        <PlaceGallery place={booking.place} />
      </div>
    </div>
  );
};
export default Bookingspage;
