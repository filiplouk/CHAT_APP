import React from "react";

function Login(props) {
  return (
    <div className="credentials__box">
      <input
        placeholder="Username"
        name="username"
        onChange={props.handleCreds}
      />
      <input
        placeholder="Password"
        name="password"
        onChange={props.handleCreds}
        type="password"
      />
      <button onClick={props.submitCreds}>Login</button>
    </div>
  );
}

export default Login;
