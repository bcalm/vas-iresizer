const redis = require('redis');
const redisClient = redis.createClient({ db: 1 });
const { get, completeProcessing } = require('./lib/imageSets');
const { saveImage, getImage } = require('./lib/fs');
const resize = require('./src/resize');

const runLoop = () => {
  get(redisClient, 'resizeQueue')
    .then(({ id, fileName, width, height }) => {
      getImage(fileName)
        .then((buffer) => resize(buffer, +width, +height))
        .then((buffer) => saveImage(buffer, fileName))
        .then((resultantFileName) =>
          completeProcessing(redisClient, id, resultantFileName)
        )
        .then(runLoop)
    })
    .catch((err) => {
      console.log(`Resizer: ${err}`);
      setTimeout(() => {
        runLoop();
      }, 1000);
    });
};

runLoop();
