import React, { useState } from "react";
import { db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";

const FoodRequests = () => {
  const [requestDetails, setRequestDetails] = useState({
    foodNeeded: "",
    quantity: "",
    contact: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setRequestDetails({
      ...requestDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "requests"), requestDetails);
      setRequestDetails({ foodNeeded: "", quantity: "", contact: "" });
      alert("Food request submitted successfully!");
    } catch (err) {
      setError("Error submitting request. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Request Food</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="foodNeeded"
          placeholder="Food Type"
          value={requestDetails.foodNeeded}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity (in kg)"
          value={requestDetails.quantity}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
          required
        />
        <input
          type="text"
          name="organizationName"
          placeholder="Organization/Individuals Name"
          value={requestDetails.organizationName}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default FoodRequests;
