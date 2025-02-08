import { useState } from "react";
import { db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";

const FoodDonationForm = () => {
  const [foodDetails, setFoodDetails] = useState({
    foodType: "",
    quantity: "",
    expirationDate: "",
    contactNumber: "",
    organizationName: "", // New field added
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFoodDetails({
      ...foodDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate fields
    if (!foodDetails.foodType || !foodDetails.quantity || !foodDetails.expirationDate || !foodDetails.contactNumber || !foodDetails.organizationName) {
      setError("Please fill in all fields.");
      return;
    }

    // Validate contact number (only digits, min length 8, max 15)
    if (!/^\d{8,15}$/.test(foodDetails.contactNumber)) {
      setError("Please enter a valid contact number (8-15 digits).");
      return;
    }

    try {
      console.log("Submitting Donation:", foodDetails);
      
      // Add to Firestore
      await addDoc(collection(db, "donations"), foodDetails);

      // Reset form
      setFoodDetails({
        foodType: "",
        quantity: "",
        expirationDate: "",
        contactNumber: "",
        organizationName: "",
      });

      setError(""); 
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error submitting donation:", err);
      setError("Error submitting donation. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Donate Food</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">Donation submitted successfully!</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            name="foodType"
            placeholder="Food Type"
            value={foodDetails.foodType}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            name="quantity"
            placeholder="Quantity (in kg)"
            value={foodDetails.quantity}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="date"
            name="expirationDate"
            value={foodDetails.expirationDate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="tel"
            name="contactNumber"
            placeholder="Contact Number"
            value={foodDetails.contactNumber}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="organizationName"
            placeholder="Organization/Individuals Name"
            value={foodDetails.organizationName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          Submit Donation
        </button>
      </form>
    </div>
  );
};

export default FoodDonationForm;
