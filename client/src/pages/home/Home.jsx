import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

function Home() {
  const [act, setAct] = useState("login");
  const [login, setLogin] = useState({});
  const [register, setRegister] = useState({});
  const navigate = useNavigate();

  function changeAct(event) {
    setAct(event.target.value);
  }

  function handleCreds(event) {
    if (act === "login") {
      if (event.target.name === "username") {
        setLogin((prev) => {
          return {
            ...prev,
            username: event.target.value,
          };
        });
      } else {
        setLogin((prev) => {
          return {
            ...prev,
            password: event.target.value,
          };
        });
      }
    } else if (act === "register") {
      if (event.target.name === "username") {
        setRegister((prev) => {
          return {
            ...prev,
            username: event.target.value,
          };
        });
      } else if (event.target.name === "password") {
        setRegister((prev) => {
          return {
            ...prev,
            password: event.target.value,
          };
        });
      } else {
        setRegister((prev) => {
          return {
            ...prev,
            email: event.target.value,
          };
        });
      }
    }
  }

  async function submitCreds() {
    if (act === "login") {
      let loginPost = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });

      if (loginPost.ok) {
        navigate("/chat_page");
      }
      console.log(loginPost);
    } else if (act === "register") {
      console.log(register);

      let registerPost = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(register),
      });
      if (registerPost.ok) {
        navigate("/chat_page");
      }
      console.log(registerPost);
    }
  }

  return (
    <div className="credentials">
      <div className="credentials__headings">
        <button onClick={changeAct} value="login">
          Login
        </button>
        <button onClick={changeAct} value="register">
          Register
        </button>
      </div>
      {act === "login" ? (
        <Login handleCreds={handleCreds} submitCreds={submitCreds} />
      ) : (
        <Register handleCreds={handleCreds} submitCreds={submitCreds} />
      )}
    </div>
  );
}

export default Home;
