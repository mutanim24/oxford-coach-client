import React from 'react';
import SearchForm from '../SearchForm/SearchForm';
import busImg from '../../assets/img/bus-1.jpg'; // adjust path as needed

const Hero = () => {
  return (
    <div
      className="hero min-h-screen bg-cover pt-10"
      style={{ backgroundImage: `url(${busImg})` }}
    >
      <div className="hero-overlay bg-black bg-opacity-50"></div>
      <div className="hero-content text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="mb-5 text-5xl font-bold text-white">
            Find Your Perfect Bus Journey
          </h1>
          <p className="mb-10 text-xl text-white">
            Book affordable and comfortable bus tickets with ease
          </p>
          <div className="flex justify-center">
            <SearchForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
