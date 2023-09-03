import { useContext, useEffect, useState } from "react";
// import {differenceInCalendarDays} from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import { differenceInCalendarDays } from "date-fns";

const BookingWidget = ({ place, maxGuests }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);
  console.log(maxGuests);

  //   useEffect(() => {
  //     if (user) {
  //       setName(user.name);
  //     }
  //   }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookThisPlace() {
    const response = await axios.post("http://localhost:4000/bookings", {
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      place: place._id,
      price: numberOfNights * place.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price:{" "}
        {"₹" +
          (place.price && typeof place.price === "number"
            ? place.price.toLocaleString()
            : "N/A")}{" "}
        / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in:</label>
            <input
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <div className="flex items-center">
            {" "}
            {/* Add "items-center" class for horizontal alignment */}
            <button
              onClick={() => {
                const newValue = numberOfGuests - 1;
                if (newValue >= 1) {
                  setNumberOfGuests(newValue);
                }
              }}
              className="px-2.5 bg-gray-400 relative right-2"
            >
              -
            </button>
            <input
              type="number"
              value={numberOfGuests}
              onChange={(ev) => {
                const enteredValue = parseInt(ev.target.value, 10);
                if (!isNaN(enteredValue)) {
                  if (enteredValue >= 1 && enteredValue <= maxGuests) {
                    alert("Exceeded The Maximum Number of Guests");
                    setNumberOfGuests(enteredValue);
                  } else if (enteredValue < 1) {
                    setNumberOfGuests(1);
                  }
                }
              }}
              max={maxGuests}
            />
            <button
              onClick={() => {
                const newValue = numberOfGuests + 1;
                if (newValue <= maxGuests) {
                  setNumberOfGuests(newValue);
                }
              }}
              className="px-2 bg-gray-400 relative left-2"
            >
              +
            </button>
          </div>
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <label>Phone number:</label>
            <input
              type="tel"
              value={phone}
              onChange={(ev) => {
                const input = ev.target.value;
                const cleanedInput = input.replace(/\D/g, "");
                const limitedInput = cleanedInput.slice(0, 10);
                setPhone(limitedInput);
              }}
              maxLength="10"
            />
          </div>
        )}
      </div>
      {numberOfNights > 0 && (
        <h2 className="text-2xl py-4">
          Total:
          {numberOfNights > 0 && (
            <span> ₹{(numberOfNights * place.price).toLocaleString()}</span>
          )}
        </h2>
      )}

      <div className="flex justify-center">
        <button
          onClick={bookThisPlace}
          className="bg-gray-800 text-white font-bold py-4 px-5 mt-4 rounded-md hover:bg-black transform transition duration-300 ease-in-out hover:scale-105"
        >
          Book this place
        </button>
      </div>
    </div>
  );
};

export default BookingWidget;
