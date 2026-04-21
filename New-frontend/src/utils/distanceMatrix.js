const GOOGLE_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;

export async function getTravelTimes(userLocation, pets) {
  if (!userLocation || pets.length === 0) return {};

  const destinations = pets
    .filter(p => p.lat && p.lng)
    .map(p => `${p.lat},${p.lng}`)
    .join("|");

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json
    ?origins=${userLocation.lat},${userLocation.lng}
    &destinations=${destinations}
    &mode=driving
    &key=${GOOGLE_KEY}`.replace(/\s/g, "");

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK") return {};

  const result = {};
  data.rows[0].elements.forEach((el, i) => {
    if (el.status === "OK") {
      result[pets[i].id] = {
        duration: el.duration.text,
        distance: el.distance.text
      };
    }
  });

  return result;
}
