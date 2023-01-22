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

const run = async (config) => {
  try {
    await poll(config);
  } catch(err) {
    console.error('Poll error', err);
  }
}

const start = () => {
  console.log(`kodiak-ha v${version}`);
  const config = getConfig();
  if(!config) process.exit(1);
  run(config);
  setInterval(() => run(config), config.interval * 1000);
};

start();
