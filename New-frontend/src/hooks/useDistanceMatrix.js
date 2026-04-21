import { useEffect, useState } from "react";
import apiClient from "../api/apiClients";

export default function useDistanceMatrix(pets) {
  const [results, setResults] = useState({});

  useEffect(() => {
  if (!pets?.length) return;

  if (!window.navigator.geolocation) {
    console.warn("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const origin = `${pos.coords.latitude},${pos.coords.longitude}`;

        const validPets = pets.filter(p => p.lat && p.lng);

        if (!validPets.length) return;

        const destinations = validPets
          .map(p => `${p.lat},${p.lng}`)
          .join("|");

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`;

        const res = await fetch(
          `https://corsproxy.io/?${encodeURIComponent(url)}`
        );

        if (!res.ok) throw new Error("Distance API failed");

        const data = await res.json();

        const map = {};
        data.rows[0]?.elements?.forEach((el, i) => {
          if (el.status === "OK") {
            map[validPets[i].id] = {
              distance: el.distance.text,
              duration: el.duration.text,
            };
          }
        });

        setResults(map);
      } catch (err) {
        console.error("Distance Matrix error", err);
      }
    },
    (err) => {
      console.warn("Location permission denied");
    }
  );
}, [pets]);

  return results;
}
