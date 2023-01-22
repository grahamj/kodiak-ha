process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection', err);
});

process.on('unhandledException', (err) => {
  console.error('Unhandled exception', err);
});

['SIGTERM', 'SIGINT'].forEach((sig) => {
  process.on(sig, async () => {
    console.info(`Exit(0) due to signal ${sig}`);
    process.exit(0);
  });
});

const { poll } = require('./poll');

const getConfig = (path = '../config.json') => {
  let config;
  try {
    config = require(path);
  } catch(err) {
    console.error(`Error loading ${__dirname}/config.json`, err.message);
    console.log('\nYou must create this file. See config.example.json in the root.');
    process.exit(1);
  }

  const errors = [];
  if(typeof config.lat !== 'number' || !config.lat) errors.push('lat must be a nonzero number');
  if(typeof config.lon !== 'number' || !config.lon) errors.push('lon must be a nonzero number');
  if(typeof config.interval !== 'number' || !config.interval) errors.push('interval must be a nonzero number');
  if(typeof config.postUrl !== 'string' || !config.postUrl.length) errors.push('postUrl must be a string');
  if(typeof config.token !== 'string' || !config.token.length) errors.push('token must be a string');

  if(errors.length) {
    console.log(errors.join('\n'));
    process.exit(1);
  }

  return config;
};

const run = async (config) => {
  try {
    await poll(config);
  } catch(err) {
    console.error('Poll error', err);
  }
}

const start = () => {
  console.log(`kodiak-mqtt v${require('../package.json').version}`);
  const config = getConfig();
  run(config);
  setInterval(() => run(config), config.interval * 1000);
};

start();
