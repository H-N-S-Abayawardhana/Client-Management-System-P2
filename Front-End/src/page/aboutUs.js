import React from "react";
import "../css/aboutus.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from '../components/templetes/Navbar';
import Footer from "../components/templetes/Footer";

// Import images
import OneImage from "../assets/one.jpeg";
import TwoImage from "../assets/two.jpeg";

const Aboutus = () => {
  return (
    <div className="nu-main">
        <Navbar />
      <div className="nu-main-container">
        <h1 className="nu-services-title">About Us</h1>
        <div className="nu-aboutus-container">
          {/* Left Section */}
          <div className="nu-aboutus-left">
            <h2 className="nu-aboutus-topic">Who We Are</h2>
            <h3 className="nu-aboutus-subtopic">"Bridging Talent and Opportunity in Emerging Markets"</h3>
            <p className="nu-aboutus-description">
              This reflects their role as an evolving executive search and recruitment agency focusing on connecting skilled professionals with businesses in burgeoning markets. It aligns with their mission to strategically expand globally while emphasizing diverse collaboration and maximizing talent retention.
            </p>
            <img src={OneImage} alt="Who We Are" className="nu-aboutus-image" />
          </div>

          {/* Right Section */}
          <div className="nu-aboutus-right">
            <h2 className="nu-aboutus-topic">Why Us</h2>
            <h3 className="nu-aboutus-subtopic">"Your Trusted Partner in Global Recruitment"</h3>
            <p className="nu-aboutus-description">
              This emphasizes Gamage Recruiters' commitment to personalized and strategic hiring solutions, fostering meaningful connections between talent and organizations worldwide. It highlights their global reach, dedication to diversity, and expertise in delivering value-driven results.
            </p>
            <img src={TwoImage} alt="Why Us" className="nu-aboutus-image" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Aboutus;
