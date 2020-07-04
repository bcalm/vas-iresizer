const redis = require('redis');
const redisClient = redis.createClient();
const { get, completeProcessing } = require('imageSets.js');
const { saveImage, getImage } = require('./connectWithFileSystem');
const { resizeImage } = require('./resizeImage');

const getJob = () => {
  return new Promise((resolve, reject) => {
    redisClient.blpop('resizeQueue', 1, (err, res) => {
      console.log(res);
      if (res) resolve(res[1]);
      else reject('no job');
    });
  });
};

const runLoop = () => {
  getJob()
    .then((id) => {
      get(redisClient, id)
        .then((details) => {
          const jobDetails = JSON.parse(details);
          getImage(jobDetails.fileName)
            .then(resizeImage)
            .then(saveImage)
            .then((fileName) => completeProcessing(redisClient, id, fileName));
        })
        .then(runLoop);
    })
    .catch((err) => {
      console.log(err);
      setTimeout(() => {
        runLoop();
      }, 1000);
    });
};

runLoop();
