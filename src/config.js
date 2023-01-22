const getConfig = (path = '../config.json') => {
  let config;
  try {
    config = require(path);
  } catch(err) {
    console.error(`Error loading ${__dirname}/config.json`, err.message);
    console.log('\nYou must create this file. See config.example.json in the root.');
    return;
  }

  const errors = [];
  if(typeof config.lat !== 'number' || !config.lat) errors.push('lat must be a nonzero number');
  if(typeof config.lon !== 'number' || !config.lon) errors.push('lon must be a nonzero number');
  if(typeof config.interval !== 'number' || !config.interval) errors.push('interval must be a nonzero number');
  if(typeof config.postUrl !== 'string' || !config.postUrl.length) errors.push('postUrl must be a string');
  if(typeof config.token !== 'string' || !config.token.length) errors.push('token must be a string');

  if(errors.length) {
    console.log(errors.join('\n'));
    return;
  }

  return config;
};

module.exports = {
  getConfig,
};
