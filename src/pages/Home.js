import React, { useEffect } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import bg from "../images/frontpagebg2.png";
import logo from "../images/airbnb.png";
import {
  ConnectButton,
  Select,
  DatePicker,
  Input,
  Icon,
  Button,
} from "web3uikit";
import { useState } from "react";
import axios from "axios";
const Home = () => {
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [destination, setDestination] = useState();
  const [guests, setGuests] = useState(2);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  let formatter = new Intl.DateTimeFormat("en-US");

  useEffect(() => {
    axios
      .get(
        `https://www.oyorooms.com/api/pwa/autocompletenew?query=ko&region=1&additionalFields=rating%2Csupply%2Ctrending%2Ctags%2Ccategory`
      )
      .then((res) => {
        console.log(res);
        let data = res.data.responseObject;
        data = data.map((d) => {
          d["label"] = d.displayName;
          d["key"] = d.id;
          return d;
        });
        setCities(() => data);
        setDestination(data[0]);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <div className="container" style={{ backgroundImage: `url(${bg})` }}>
        {/* <div className="containerGradinet"></div> */}
        <div className="tipBanner">
          <div>
            <img className="logo" src={logo} alt="logo"></img>
          </div>
          <div className="tabs">
            <div className="selected">Places To Stay</div>
            <div>Experiences</div>
            <div>Online Experiences</div>
          </div>
          <div className="lrContainers">
            {/* <ConnectButton></ConnectButton> */}
          </div>
        </div>
        <div className="tabContent">
          <div className="searchFields">
            <div className="inputs">
              Location
              <Select
                defaultOptionIndex={0}
                onChange={(data) => {
                  setSelectedCity(data);
                  setDestination(data);
                }}
                options={cities}
              ></Select>
            </div>
            <div className="vl" />
            <div className="inputs">
              Check In
              <DatePicker
                id="CheckIn"
                onChange={(event) => setCheckIn(event.date)}
              ></DatePicker>
            </div>
            <div className="vl" />
            <div className="inputs">
              Check Out
              <DatePicker
                id="CheckOut"
                onChange={(event) => setCheckOut(event.date)}
              ></DatePicker>
            </div>
            <div className="vl" />
            <div className="inputs">
              Guests
              <Input
                value={2}
                name="AddGuests"
                type="number"
                onChange={(event) => setGuests(Number(event.target.value))}
              ></Input>
            </div>
            <Link
              to="/rentals"
              state={{
                destination: destination,
                checkIn: checkIn,
                checkOut: checkOut,
                guests: guests,
                latitude: selectedCity?.centerPoint.lat,
                longitude: selectedCity?.centerPoint.lng,
                checkin: `${formatter.format(checkIn)}`,
                checkout: `${formatter.format(checkOut)}`,
              }}
            >
              <div className="searchButton">
                <Icon fill="#ffffff" size={24} svg="search" />
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="randomLocation">
        <div className="title">Fee adventurous</div>
        <div className="text">
          Let us decide and discover new places to stay, live, work, or just
          relax.
        </div>
        <Button
          text="Explore a Location"
          onClick={() => console.log("explore clicked")}
        ></Button>
      </div>
    </>
  );
};

export default Home;
