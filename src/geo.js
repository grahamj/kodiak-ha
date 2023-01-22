const validateLat = (lat) => {
  return typeof lat === 'number' && lat >= -90 && lat <= 90;
};

const validateLon = (lon) => {
  return typeof lon === 'number' && lon >= -180 && lon <= 180;
};

const validate = (lat, lon) => {
  return validateLat(lat) && validateLon(lon) && !(lat === 0 && lon === 0);
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

const distance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Number.isNaN(d) ? 0 : Math.floor(d * 1000);
};

module.exports = {
  validate,
  distance,
};
