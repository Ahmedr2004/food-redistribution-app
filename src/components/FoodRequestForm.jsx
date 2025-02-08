import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const FoodRequestForm = () => {
  const [requestDetails, setRequestDetails] = useState({
    foodType: "",
    quantity: "",
    contact: "",
  });

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
      setRequestDetails({ foodType: "", quantity: "", contact: "" });
      alert("Request submitted successfully!");
    } catch (err) {
      alert("Error submitting request.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Request Food</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="foodType"
          placeholder="Food Type"
          value={requestDetails.foodType}
          onChange={handleChange}
          className="w-full p-3 border rounded-md mb-4"
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity (in kg)"
          value={requestDetails.quantity}
          onChange={handleChange}
          className="w-full p-3 border rounded-md mb-4"
          required
        />
        <input
          type="text"
          name="organizationName"
          placeholder="Organization/Individuals Name"
          value={requestDetails.organizationName}
          onChange={handleChange}
          className="w-full p-3 border rounded-md mb-4"
          required
        />
        <button className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700">
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default FoodRequestForm;
