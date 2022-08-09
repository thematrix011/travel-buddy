import "./register.css";
import * as React from "react";
import { Room, Cancel } from "@material-ui/icons";
import { useState, useRef } from "react";
import axios from "axios";

export default function Register({ setshowRegister }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const usernameRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();

  const handleRegistration = async (e) => {
    e.preventDefault(); // page wont reload on submit
    const newUser = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passRef.current.value,
    };
    try {
      await axios.post("/user/register", newUser);
      setError(false);
      setSuccess(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="registerContainer">
      <div className="logo">
        <Room />
        <span>TravelBuddy</span>
      </div>
      <form onSubmit={handleRegistration}>
        <input type="text" placeholder="username" ref={usernameRef} />
        <input type="email" placeholder="email" ref={emailRef} />
        <input type="password" placeholder="password" ref={passRef} />
        <button className="registerBtn">Register</button>
        {success && (
          <span className="success">Registeration done, you can login</span>
        )}
        {error && <span className="failure">Something went wrong</span>}
      </form>
      <Cancel
        className="cancelReg"
        onClick={() => {
          setshowRegister(false);
        }}
      />
    </div>
  );
}
