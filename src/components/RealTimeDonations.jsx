import { useState, useEffect, useRef } from "react";
import { db } from "../services/firebase";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";

const RealTimeDonations = () => {
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const notifiedMatches = useRef(new Set());

  useEffect(() => {
    const unsubscribeDonations = onSnapshot(collection(db, "donations"), (snapshot) => {
      const donationsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDonations(donationsData.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate)));
    });

    const unsubscribeRequests = onSnapshot(collection(db, "requests"), (snapshot) => {
      const requestsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(requestsData);
    });

    return () => {
      unsubscribeDonations();
      unsubscribeRequests();
    };
  }, []);

  const handleMatchAndUpdate = async (donation, requestId, requestQuantity) => {
    try {
      const remainingQuantity = donation.quantity - requestQuantity;
      
      if (remainingQuantity > 0) {
        await updateDoc(doc(db, "donations", donation.id), { quantity: remainingQuantity });
      } else {
        await deleteDoc(doc(db, "donations", donation.id));
      }

      await deleteDoc(doc(db, "requests", requestId));
      notifiedMatches.current.delete(requestId);

      sendNotification("Food Matched!", "A donation has been successfully matched and updated.");
      alert("Matched donation and request successfully updated.");
    } catch (error) {
      console.error("Error updating matched donation and request:", error);
      alert("Error updating matched donation and request.");
    }
  };

  const sendNotification = (title, message) => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support desktop notifications.");
      return;
    }

    if (Notification.permission === "granted") {
      new Notification(title, { body: message });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body: message });
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Real-Time Food Donations</h2>
      <p className="mb-4">Matching food donations based on expiry date and quantity.</p>
      
      <h3 className="text-xl font-semibold mt-6">Available Donations</h3>
      <div>
        {donations.length > 0 ? (
          donations.map((donation) => (
            <div key={donation.id} className="bg-white p-4 mb-4 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold">{donation.foodType}</h3>
              <p>Quantity: {donation.quantity} kg</p>
              <p>Expires on: {donation.expirationDate}</p>
              <p>Organization/Individuals Name: {donation.organizationName}</p>
              <p>Contact Number: {donation.contactNumber}</p>
            </div>
          ))
        ) : (
          <p>No donations available right now.</p>
        )}
      </div>

      <h3 className="text-xl font-semibold mt-6">Request History</h3>
      <div>
        {requests.length > 0 ? (
          requests.map((request) => {
            const matchedDonation = donations.find(
              (donation) =>
                donation.foodType.trim().toLowerCase() === request.foodNeeded.trim().toLowerCase() &&
                parseInt(request.quantity) <= parseInt(donation.quantity)
            );

            if (matchedDonation && !notifiedMatches.current.has(request.id)) {
              sendNotification(
                "Match Found!",
                `A donation for ${request.foodNeeded} (${request.quantity} kg) is available!`
              );
              notifiedMatches.current.add(request.id);
            }

            return (
              <div key={request.id} className="bg-white p-4 mb-4 shadow-md rounded-lg">
                <h3 className="text-lg font-semibold">{request.foodNeeded}</h3>
                <p>Requested Quantity: {request.quantity} kg</p>
                <p>Organization/Individuals Name: {request.organizationName}</p>

                {matchedDonation ? (
                  <button
                    onClick={() => handleMatchAndUpdate(matchedDonation, request.id, parseInt(request.quantity))}
                    className="mt-4 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Match and Update
                  </button>
                ) : (
                  <p className="text-gray-500">No matching donation found.</p>
                )}
              </div>
            );
          })
        ) : (
          <p>No requests found in the history.</p>
        )}
      </div>
    </div>
  );
};

export default RealTimeDonations;
