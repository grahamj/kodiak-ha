const axios = require('axios');
const geo = require('./geo');

const getRecords = async () => {
  let response;
  try {
    response = await axios.get('https://kodiaksnow.ca/gps_map/json.php');
  } catch(err) {
    console.error('Error requesting records', err);
  }

  const uniqueMap = new Map();
  const now = Date.now();
  response.data
    .filter(r => r.active && r.latitude !== 0 && r.longitude !== 0)
    // Inject since
    .map(r => {
      if(!r.date || !r.date.date) return;
      r.since = now - new Date(r.date.date);
      return r;
    })
    .filter(r => !!r)
    // Descending order of since (least to most recent)
    .sort((a, b) => b.since - a.since)
    .forEach(r => uniqueMap.set(r.device_id, r));

  return Array.from(uniqueMap.values());
};

const findClosest = (records, lat, lon) => {
  let closest = { distance: Infinity };
  records.forEach((record, index) => {
    const { latitude, longitude } = record;
    if(!geo.validate(latitude, longitude)) {
      console.log(`record[${index}] fails geo validation`, { latitude, longitude });
      return;
    }

    const distance = geo.distance(latitude, longitude, lat, lon);
    if(distance < closest.distance) {
      closest = {
        ...record,
        distance,
      };
    }
  });

  if(closest.distance === Infinity) {
    return;
  }

  return closest;
};

const getStats = (records) => {
  let active = 0;
  let hasDirection = 0;
  let hasSpeed = 0;
  records.forEach((record) => {
    if(record.active) active++;
    if(record.direction) hasDirection++;
    if(record.speed) hasSpeed++;
  });
  return { active, total: records.length, hasDirection, hasSpeed };
};

const poll = async (config) => {
  const { lat, lon, token, postUrl } = config;

  console.log('Polling...');
  const records = await getRecords();
  const stats = getStats(records);
  console.log(`Got ${stats.total} records, ${stats.active} active, ${stats.hasSpeed} nonzero speed`);
  const closest = findClosest(records, lat, lon);

  if(!closest) {
    console.log('No valid records found');
    return;
  }

  console.log('Closest:', closest);

  const payload = {
    state: closest.distance,
    attributes: {
      tractor_name: closest.name,
      speed: closest.speed,
      // since: closest.since,
      date: closest.date,
      lat: closest.latitude,
      lon: closest.longitude,
      radius: closest.radius,
      date: closest?.date?.date ? new Date(closest.date.date).toString() : undefined,
      timestamp: closest?.date?.date ? new Date(closest.date.date).getTime() : undefined,
      // requested: new Date().toString(),
    }
  };
  console.log('Sending', payload);
  await axios.post(postUrl, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return closest;
};

module.exports = {
  poll,
};
