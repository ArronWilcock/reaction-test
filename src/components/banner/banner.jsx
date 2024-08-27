// Importing necessary components and styles
import React from "react";
import { Link, useLocation } from "react-router-dom"; // Importing Link and useLocation from react-router-dom
import Logo from "../../images/Amz-logo.png";
import "./banner.scss";

// Defining the Banner component
function Banner() {
  const location = useLocation(); // Getting the current location using useLocation hook from react-router-dom

  // Checking various conditions based on the current location
  const isHomePage = location.pathname === "/";

  return (
    <div className="rt-banner">
      <img src={Logo} alt="Amazon Logo" className="Amz-logo" />
      <div className="right-nav">
        <ul>
          {!isHomePage && (
            <li>
              <Link to="/" className="nav-link">
                HOME
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Banner;
