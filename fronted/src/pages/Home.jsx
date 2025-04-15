import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Background Image */}
      <img
        src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Ftraffic-signals-uk&psig=AOvVaw3pDsOA3wL3p02AIB0zF67K&ust=1744729264689000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJC9upjl14wDFQAAAAAdAAAAABAO" // Place image inside /public folder
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Uber Logo */}
      <img
        className="w-16 absolute top-4 left-4 z-10"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt="Uber Logo"
      />

      {/* Bottom Content */}
      <div className="absolute bottom-0 w-full z-10 bg-white px-4 py-6">
        <h2 className="text-xl font-bold mb-3">Get Started with Uber</h2>
        <Link
          to="/login" // Change this path to wherever your next page is
          className="block text-center bg-black text-white py-2 rounded text-base font-medium"
        >
          Continue
        </Link>
      </div>
    </div>
  );
};

export default Home;

