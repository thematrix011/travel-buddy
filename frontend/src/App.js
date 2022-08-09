import * as React from "react";
import { useState, useEffect } from "react";

import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { Room, Star } from "@material-ui/icons";
import "./App.css";
import axios from "axios";
import { format } from "timeago.js";

import Register from "./components/register/Register";
import Login from "./components/login/Login";

function App() {
  const [pins, setPins] = useState([]);
  const myStorage = window.localStorage;

  const [currentPlaceId, setCurrentPlaceId] = useState();

  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));

  const [newPlace, setNewPlace] = useState(null);
  const [title, setNewTitle] = useState(null);
  const [desc, setNewDesc] = useState(null);
  const [rating, setNewRating] = useState(0);

  const [showRegister, setshowRegister] = useState(null);

  const [showLogin, setshowLogin] = useState(0);

  const [viewState, setViewState] = useState({
    longitude: 3,
    latitude: 48,
    zoom: 3.5,
  });
  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);
  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewState({ ...viewState, latitude: lat, longitude: long }); // centering the map to set view int centre to clicked pin
  };
  const handleAddClick = (e) => {
    const { lat, lng } = e.lngLat;
    setNewPlace({
      lat,
      lng,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.lng,
    };
    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <div className="App">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        style={{ width: "100vw", height: "100vh" }}
        onDblClick={handleAddClick}
      >
        {pins.map((p) => (
          <>
            <Marker
              className="marker"
              longitude={p.long}
              latitude={p.lat}
              onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              style={{
                color: p.username === currentUser ? "tomato" : "slateblue",
              }}
            >
              <Room />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                longitude={p.long}
                latitude={p.lat}
                anchor="bottom"
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="star">
                    {Array(p.rating).fill(<Star className="star" />)}{" "}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}{" "}
          </>
        ))}

        {newPlace && (
          <Popup
            longitude={newPlace.lng}
            latitude={newPlace.lat}
            anchor="bottom"
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder="Enter a title"
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <label>Description</label>
                <textarea
                  placeholder="Say something about this place"
                  onChange={(e) => setNewDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setNewRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button type="submit" className="submitButton">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}
        {showRegister && <Register setshowRegister={setshowRegister} />}

        {showLogin && (
          <Login
            setshowLogin={setshowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </Map>
      {currentUser ? (
        <button className="button logout" onClick={handleLogout}>
          Log out
        </button>
      ) : (
        <div className="logReg">
          <button className="button login" onClick={() => setshowLogin(true)}>
            Login
          </button>
          <button
            className="button register"
            onClick={() => setshowRegister(true)}
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
