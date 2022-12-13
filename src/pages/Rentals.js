import React from "react";
import "./Rentals.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import logo from "../images/airbnbRed.png";
import { Button, ConnectButton, Icon, useNotification } from "web3uikit";
import RentalsMap from "../components/RentalsMap";
import { useState, useEffect } from "react";
// import { useMoralis, useWeb3Web3ExecuteFunction } from "react-moralis";
import User from "../components/User";
import axios from "axios";
import Web3 from "web3";
import { hotelsData } from "./data";

const Rentals = () => {
  const { state: searchFilters } = useLocation();
  const [highlight, setHighlight] = useState();
  // const { Moralis, account } = useMoralis();
  const account = null;
  const [rentalsList, setRentalsList] = useState([]);
  const [coords, setCoords] = useState([]);
  const dispatch = useNotification();
  // const contractProcessor = useWeb3ExecuteFunction();

  let provider = window.ethereum;
  let selectedAccount;

  if (typeof provider !== "undefined") {
    provider.request({ method: "eth_requestAccounts" }).then((accounts) => {
      selectedAccount = accounts[0];
      console.log(`Selected account is ${selectedAccount}`);
    });
  }

  const web3 = new Web3(provider);
  window.ethereum.on('accountsChanged', function (accounts) {
    console.log('account changed')
    selectedAccount=accounts[0];
  })

  async function loadContract() {
    let address = "0x4d66C75Fc5E33eA6Cdd373f34D1Bf9374D7Df44c";
    let chainlinkFutureContractABI = [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string[]",
            "name": "datesBooked",
            "type": "string[]"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "booker",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "city",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "imgUrl",
            "type": "string"
          }
        ],
        "name": "newDatesBooked",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "city",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "lat",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "long",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "unoDescription",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "dosDescription",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "imgUrl",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "maxGuests",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "pricePerDay",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string[]",
            "name": "datesBooked",
            "type": "string[]"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "renter",
            "type": "address"
          }
        ],
        "name": "rentalCreated",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string[]",
            "name": "newBookings",
            "type": "string[]"
          }
        ],
        "name": "addDatesBooked",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "city",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "lat",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "long",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "unoDescription",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "dosDescription",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "imgUrl",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "maxGuests",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "pricePerDay",
            "type": "uint256"
          },
          {
            "internalType": "string[]",
            "name": "datesBooked",
            "type": "string[]"
          }
        ],
        "name": "addRentals",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "contract IERC20",
            "name": "token",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          }
        ],
        "name": "getRental",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          },
          {
            "internalType": "string[]",
            "name": "",
            "type": "string[]"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "rentalIds",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    var chainlinkFutureContract = new web3.eth.Contract(
      chainlinkFutureContractABI,
      address
    );

    return await chainlinkFutureContract;
  }
  const handleSuccess = () => {
    dispatch({
      type: "success",
      message: `Nice! You are going to ${searchFilters.destination.label}`,
      title: "Booking Successful",
      position: "topR",
    });
  };

  const handleError = (err) => {
    dispatch({
      type: "error",
      message: `${err}`,
      title: "Booking Failed",
      position: "topR",
    });
  };

  useEffect(() => {
    async function fetchRentalsList() {
      // const Rentals = Moralis.Object.extend("rentals");
      // const query = new Moralis.Query(Rentals);
      // query.equalTo("city", searchFilters.destination);
      // query.greaterThanOrEqualTo("maxGuests_decimal", searchFilters.guests);
      // const results = await query.find();
      // setRentalsList(results);
      console.log(searchFilters);
      const location = `${searchFilters.destination.displayName}`
        .replaceAll(" ", "%2520")
        .replaceAll(",", "%252C");
      const checkin = `${searchFilters.checkin}`.replaceAll("/", "%252F");
      const checkout = `${searchFilters.checkout}`.replaceAll("/", "%252F");
      const url = `https://www.oyorooms.com/api/pwa/getListingPage?url=%2Fsearch%3Flocation%3D${location}%26latitude%3D${searchFilters.latitude}%26longitude%3D${searchFilters.longitude}%26searchType%3Dlocality%26coupon%3D%26checkin%3D${checkin}%26checkout%3D${checkout}%26roomConfig%255B%255D%3D2%26country%3Dindia%26guests%3D${searchFilters.guests}%26rooms%3D1&locale=en`;
      // axios
      //   .get(url)
      //   .then((res) => {
      //     setRentalsList(d=>res.data.searchData.hotels);
      //     let cords = [];
      //     res.data.searchData.hotels.forEach((e, index) => {
      //       cords.push({ lat: +e.latitude, lng: +e.longitude });
      //     });
      //     setCoords(d=>cords);
      //     console.log(coords)
      //   })
      //   .catch((error) => console.error(error));
      const resData = hotelsData;
      setRentalsList(JSON.parse(resData));

      // subscribing to events
      // web3.eth.subscribe()

      // listening to events
      let linkContract = await loadContract();

      linkContract.events
        .newDatesBooked()
        .on("connected", (d) => {
          console.log("connected");
          console.log(d);
        })
        .on("data", (d) => {
          console.log("data");
              handleSuccess();
        })
        .on("changed", (d) => {
          console.log("changed");
          console.log(d);
        })
        .on("error", (d) => {
          console.log("error");
          console.log(d);
          handleError(d);
        });
    }
    fetchRentalsList();
  }, [searchFilters]);

  const bookRental = async function (start, end, id, dayPrice) {
    console.log(id);
    id = 0;
    for (
      var arr = [], dt = new Date(start);
      dt <= end;
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt).toISOString().slice(0, 10)); // yyyy-mm-dd
    }

    let options = {
      contractAddress: "0x1531f16C5b8CC03aABB86b14633387A26b90D15D",
      functionName: "addDatesBooked",
      abi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "string[]",
              name: "datesBooked",
              type: "string[]",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address",
              name: "booker",
              type: "address",
            },
            {
              indexed: false,
              internalType: "string",
              name: "city",
              type: "string",
            },
            {
              indexed: false,
              internalType: "string",
              name: "imgUrl",
              type: "string",
            },
          ],
          name: "newDatesBooked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              indexed: false,
              internalType: "string",
              name: "city",
              type: "string",
            },
            {
              indexed: false,
              internalType: "string",
              name: "lat",
              type: "string",
            },
            {
              indexed: false,
              internalType: "string",
              name: "long",
              type: "string",
            },
            {
              indexed: false,
              internalType: "string",
              name: "unoDescription",
              type: "string",
            },
            {
              indexed: false,
              internalType: "string",
              name: "dosDescription",
              type: "string",
            },
            {
              indexed: false,
              internalType: "string",
              name: "imgUrl",
              type: "string",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "maxGuests",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "pricePerDay",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string[]",
              name: "datesBooked",
              type: "string[]",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address",
              name: "renter",
              type: "address",
            },
          ],
          name: "rentalCreated",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "string[]",
              name: "newBookings",
              type: "string[]",
            },
          ],
          name: "addDatesBooked",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "city",
              type: "string",
            },
            {
              internalType: "string",
              name: "lat",
              type: "string",
            },
            {
              internalType: "string",
              name: "long",
              type: "string",
            },
            {
              internalType: "string",
              name: "unoDescription",
              type: "string",
            },
            {
              internalType: "string",
              name: "dosDescription",
              type: "string",
            },
            {
              internalType: "string",
              name: "imgUrl",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "maxGuests",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "pricePerDay",
              type: "uint256",
            },
            {
              internalType: "string[]",
              name: "datesBooked",
              type: "string[]",
            },
          ],
          name: "addRentals",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
          ],
          name: "getRental",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "string[]",
              name: "",
              type: "string[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "rentalIds",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      params: {
        id: id,
        newBookings: arr,
      },
      msgValue: dayPrice,
    };
    console.log(arr);
    let linkContract = await loadContract();
    // console.log(await linkContract.methods.getRental(0).call({
    //   from: selectedAccount,
    // }))
    console.log(linkContract.methods.addDatesBooked(id, arr));
    linkContract.methods
      .addDatesBooked(id + "", arr)
      .send(
        {
          from: selectedAccount,
        },
        (error, result) => {
          console.log(error);
          console.log(result);
          dispatch({
            type: "info",
            message: `Thank you for choosing us, please wait while we confirm you payment.`,
            title: "Verifying your payment",
            position: "topR",
          });
        }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
        if (error) {
          handleError(error.message);
        }
      });
    //   , function(error, result){
    //     console.log('error--')
    //     console.log(error)
    //     console.log('error--')
    //     console.log('res--')
    //     console.log(result)
    //     console.log('res--')
    // });
    // await contractProcessor.fetch({
    //   params: options,
    //   onSuccess: () => {
    //     handleSuccess();
    //   },
    //   onError: (error) => {
    //     handleError(error.data.message);
    //   },
    // });
  };
  const handleNoAccount = () => {
    dispatch({
      type: "error",
      message: `You need to connect your wallet to book a rental`,
      title: "Not Connected",
      position: "topL",
    });
  };

  return (
    <>
      <div className="topBanner">
        <div>
          <Link to={"/"}>
            <img className="logo" src={logo} alt="logo"></img>
          </Link>
        </div>
        <div className="searchReminder">
          <div className="filter">{searchFilters?.destination.label}</div>
          <div className="vl"></div>
          <div className="filter">
            {`
            ${searchFilters.checkIn.toLocaleString("default", {
              month: "short",
            })}
            ${searchFilters.checkIn.toLocaleString("default", {
              day: "2-digit",
            })}
             -
             ${searchFilters.checkOut.toLocaleString("default", {
               month: "short",
             })}
            ${searchFilters.checkOut.toLocaleString("default", {
              day: "2-digit",
            })}
            `}
          </div>
          <div className="vl"></div>
          <div className="filter">{searchFilters.guests} Guest </div>
          <div className="searchFiltersIcon">
            <Icon fill="#ffffff" size={20} svg="search" />
          </div>
        </div>
        <div className="lrContainers">
          {account && <User account={account} />}
          {/* <ConnectButton> </ConnectButton> */}
        </div>
      </div>
      <hr className="line"></hr>
      <div className="rentalsContent">
        <div className="rentalsContentL">
          Stays available for your destination
          {rentalsList &&
            rentalsList.map((rental, i) => {
              return (
                <div key={rental.id}>
                  <hr className="line2"></hr>
                  <div className={highlight == i ? "rentalDivH" : "rentalDiv"}>
                    <img className="rentalImg" src={rental.best_image}></img>
                    <div className="rentalInfo">
                      <div className="rentalTitle">
                        {rental.hotel_name_without_category}
                      </div>
                      <div className="rentalDesc">{rental.address}</div>
                      <div className="bottomButton">
                        <Button
                          text="Stay Here"
                          onClick={() => {
                            // if (account) {
                            bookRental(
                              searchFilters.checkIn,
                              searchFilters.checkOut,
                              rental.id,
                              Number(
                                rental.category_wise_pricing[
                                  rental.selected_category_id
                                ]?.final_price / 102210.93
                              )
                            );
                            // } else {
                            //   handleNoAccount();
                            // }
                          }}
                        ></Button>
                        <div className="price">
                          <Icon fill="#808080" size={10} svg="matic" />
                          {rental.category_wise_pricing[
                            rental.selected_category_id
                          ]?.final_price}
                          / Day
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="rentalsContentR">
          <RentalsMap
            locations={coords}
            setHighlight={setHighlight}
          ></RentalsMap>
        </div>
      </div>
    </>
  );
};

export default Rentals;
