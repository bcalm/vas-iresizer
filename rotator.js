const redis = require('redis');
const redisClient = redis.createClient({ db: 1 });
const { get, completeProcessing } = require('./lib/imageSets');
const { saveImage, getImage } = require('./lib/fs');
const rotate = require('./src/rotate');

const runLoop = () => {
  get(redisClient, 'rotateQueue')
    .then(({ id, fileName, angle }) => {
      getImage(fileName)
        .then((buffer) => rotate(buffer, +angle))
        .then((buffer) => saveImage(buffer, fileName))
        .then((resultantFileName) =>
          completeProcessing(redisClient, id, resultantFileName)
        );
    })
    .then(runLoop)
    .catch((err) => {
      console.log(`Rotator: ${err}`);
      setTimeout(() => {
        runLoop();
      }, 1000);
    });
};

runLoop();
