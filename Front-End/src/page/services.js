import React from "react";
import "../css/services.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from '../components/templetes/MainNav';
import Footer from "../components/templetes/Footer";

// Import new images
import ServicesImg1 from '../assets/services-img1.png';
import ServicesImg2 from '../assets/services-img2.png';
import ServicesImg3 from '../assets/services-img3.png';

const Services = () => {
  return (
    <div className="nu-main">
      <Navbar />
      <div className="nu-services-container">
        <h1 className="nu-services-title">Services</h1>
        <p className="nu-services-description">
          This reflects their role as an evolving executive search and recruitment agency focusing on connecting skilled professionals with businesses in burgeoning markets. It aligns with their mission to strategically expand globally while emphasizing diverse collaboration and maximizing talent retention.
        </p>
        <p className="nu-services-description">
          Gamage Recruiters Service is a professional talent acquisition and recruitment agency dedicated to connecting businesses with the right talent. We specialize in providing customized staffing solutions tailored to meet the unique needs of each employee. Our services include candidate sourcing, screening, and placement across various industries, ensuring a seamless recruitment process.
        </p>
        <p className="nu-services-description">
          At Gamage Recruiters Service, we are committed to delivering exceptional service, building lasting partnerships, and helping organizations grow by bringing the best talent onboard. Whether you're a business seeking skilled professionals or a candidate looking for your next opportunity, we're here to make the connection.
        </p>

        <div className="nu-services-boxes">
          <div className="nu-service-box">
            <img src={ServicesImg1} alt="Diversity Icon" className="nu-service-icon" />
            <h3 className="nu-service-topic">DIVERSITY RECRUITING</h3>
            <p className="nu-service-text">
              Gamage Recruiters focuses on diversity in the workplace and taps into talent from emerging markets and industries.
            </p>
          </div>
          <div className="nu-service-box2">
            <img src={ServicesImg2} alt="Technology Icon" className="nu-service-icon" />
            <h3 className="nu-service-topic">TECHNOLOGY STAFFING</h3>
            <p className="nu-service-text">
              Gamage Recruiters provides technology staffing services.
            </p>
          </div>
          <div className="nu-service-box">
            <img src={ServicesImg3} alt="Compliance Icon" className="nu-service-icon" />
            <h3 className="nu-service-topic">WORKFORCE COMPLIANCE</h3>
            <p className="nu-service-text">
              Gamage Recruiters provides workforce compliance services.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Services;
