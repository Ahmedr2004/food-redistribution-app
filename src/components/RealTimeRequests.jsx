import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

const RealTimeRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "requests"), (snapshot) => {
      const requestData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(requestData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">NGO Food Requests</h2>
      {requests.length > 0 ? (
        requests.map((request) => (
          <div key={request.id} className="border p-4 mb-2 rounded shadow">
            <h3 className="text-lg font-semibold">{request.foodType}</h3>
            <p>Quantity Needed: {request.quantity} kg</p>
            <p>Contact: {request.contact}</p>
          </div>
        ))
      ) : (
        <p>No requests available.</p>
      )}
    </div>
  );
};

export default RealTimeRequests;
