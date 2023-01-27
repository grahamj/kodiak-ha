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
const { getConfig } = require('./config');
const { version } = require('../package.json');

process.env.TZ = 'America/Montreal';
let config;

const run = async () => {
  let distance;
  try {
    distance = await poll(config);
  } catch(err) {
    console.error('Poll error', err);
  }
  const delay = distance ? Math.max(Math.round(distance / 10), 10) : 300; // default 5 min
  console.log(`Waiting ${delay}s`);
  setTimeout(() => run(config), delay * 1000);
}

const start = () => {
  console.log(`kodiak-ha v${version}`);
  config = getConfig();
  if(!config) process.exit(1);
  run();
};

start();
