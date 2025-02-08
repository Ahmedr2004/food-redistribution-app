import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FoodDonationForm from "./components/FoodDonationForm";
import RealTimeDonations from "./components/RealTimeDonations";
import FoodRequests from "./components/FoodRequests";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <nav className="bg-blue-600 p-4 shadow-md">
          <div className="container mx-auto flex justify-between">
            <h1 className="text-white text-2xl font-bold">Smart Food Redistribution</h1>
            <div>
              <Link to="/" className="text-white px-4">Home</Link>
              <Link to="/donate" className="text-white px-4">Donate</Link>
              <Link to="/requests" className="text-white px-4">Requests</Link>
            </div>
          </div>
        </nav>
        
        <div className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<RealTimeDonations />} />
            <Route path="/donate" element={<FoodDonationForm />} />
            <Route path="/requests" element={<FoodRequests />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
