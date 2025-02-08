import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";

const MatchDonations = () => {
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const unsubscribeDonations = onSnapshot(
      query(collection(db, "donations")),
      (snapshot) => {
        setDonations(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );

    const unsubscribeRequests = onSnapshot(
      query(collection(db, "requests")),
      (snapshot) => {
        setRequests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );

    return () => {
      unsubscribeDonations();
      unsubscribeRequests();
    };
  }, []);

  useEffect(() => {
    const newMatches = [];
    donations.forEach((donation) => {
      requests.forEach((request) => {
        if (
          donation.foodType.toLowerCase() === request.foodNeeded.toLowerCase() &&
          parseInt(donation.quantity) >= parseInt(request.quantity)
        ) {
          newMatches.push({ donation, request });
        }
      });
    });

    setMatches(newMatches);
  }, [donations, requests]);

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold text-center mb-4">Food Matches</h2>
      {matches.length === 0 ? (
        <p className="text-center text-gray-600">No matches found yet.</p>
      ) : (
        matches.map((match, index) => (
          <div key={index} className="p-4 bg-white shadow-md rounded-lg mb-4">
            <h3 className="text-lg font-semibold">Match {index + 1}</h3>
            <p><strong>Food:</strong> {match.donation.foodType}</p>
            <p><strong>Quantity:</strong> {match.donation.quantity} kg</p>
            <p><strong>Donor Contact:</strong> {match.donation.contact}</p>
            <p><strong>Requester Contact:</strong> {match.request.contact}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MatchDonations;
