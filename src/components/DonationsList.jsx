import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

const DonationsList = () => {
  const [donations, setDonations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDonations = async () => {
      const querySnapshot = await getDocs(collection(db, "donations"));
      const donationsData = querySnapshot.docs.map((doc) => doc.data());
      setDonations(donationsData);
    };
    fetchDonations();
  }, []);

  const filteredDonations = donations.filter((donation) =>
    donation.foodType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Available Food Donations</h2>
      <input
        type="text"
        placeholder="Search by food type"
        className="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div>
        {filteredDonations.length > 0 ? (
          filteredDonations.map((donation, index) => (
            <div key={index} className="bg-white p-4 mb-4 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold">{donation.foodType}</h3>
              <p>Quantity: {donation.quantity} kg</p>
              <p>Expires on: {donation.expirationDate}</p>
              <p>Contact: {donation.contact}</p>
            </div>
          ))
        ) : (
          <p>No donations found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default DonationsList;
