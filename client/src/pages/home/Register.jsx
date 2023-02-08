import React from "react";

function Register(props) {
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
      <input placeholder="Email" name="email" onChange={props.handleCreds} />
      <button onClick={props.submitCreds}>Register</button>
    </div>
  );
}

export default Register;
