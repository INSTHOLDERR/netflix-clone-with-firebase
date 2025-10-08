import React, { useState, useEffect } from "react";
import "./Login.css";
import logo from "../../assets/logo.png";
import { login, signup } from "../../firebase";
import netflix_spinner from "../../assets/netflix_spinner.gif";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [signState, setSignState] = useState("Sign In");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordsMatch = password === confirmPassword && password.length > 0;

  // Redirect to home if already logged in (login or signup)
  useEffect(() => {
    if (currentUser) {
      navigate("/"); // Go to Home page
    }
  }, [currentUser, navigate]);

  const user_auth = async (event) => {
    event.preventDefault();

    // Check passwords match for signup
    if (signState === "Sign Up" && !passwordsMatch) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      if (signState === "Sign In") {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
    } catch (error) {
      console.error("Authentication Error:", error);
    }

    setLoading(false);
  };

  return loading ? (
    <div className="login-spinner">
      <img src={netflix_spinner} alt="Loading..." />
    </div>
  ) : (
    <div className="login">
      <img src={logo} className="login-logo" alt="App Logo" />

      <div className="login-form">
        <h1>{signState}</h1>

        <form onSubmit={user_auth}>
          {signState === "Sign Up" && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Your Name"
              name="name"
              required
            />
          )}

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            name="email"
            required
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            name="password"
            required
          />

          {signState === "Sign Up" && (
            <div className="password-check-container">
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                required
              />
              <span className="password-check">
                {confirmPassword.length > 0 &&
                  (passwordsMatch ? (
                    <AiOutlineCheck className="match" />
                  ) : (
                    <AiOutlineClose className="no-match" />
                  ))}
              </span>
            </div>
          )}

          <button type="submit">{signState}</button>

          <div className="form-help">
            <div className="remember">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember Me</label>
            </div>
            <p className="help-text">Need Help?</p>
          </div>
        </form>

        <div className="form-switch">
          {signState === "Sign In" ? (
            <p>
              New to Netflix?{" "}
              <span onClick={() => setSignState("Sign Up")}>Sign Up Now</span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => setSignState("Sign In")}>Sign In Now</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
