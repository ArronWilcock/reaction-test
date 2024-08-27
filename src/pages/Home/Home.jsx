import React from "react";
import { Link } from "react-router-dom";
import "./Home.scss";
import Banner from "../../components/banner/banner";
import LoadingSpinner from "../../components/loadingspinner/loadingspinner";

function HomePage() {
  return (
    <div>
      <Banner />
      <LoadingSpinner />
      <div>
        <Link to="/single-player">
          <button>Single Player</button>
        </Link>
        <Link to="/vs-mode">
          <button>VS Mode</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
