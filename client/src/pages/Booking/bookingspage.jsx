import { useParams } from "react-router-dom";
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../UserContext";
import AccountNav from "../Account/accoutnav";
import Navbar from "../Navbar/navbar";

const Bookingspage = () => {
  const { id } = useParams();
  return (
    <div>
      <Navbar />
      <AccountNav />
      <span>Single bookingspage:{id}</span>
    </div>
  );
};

export default Bookingspage;
