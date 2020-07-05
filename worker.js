const redis = require('redis');
const redisClient = redis.createClient({ db: 1 });
const { get, completeProcessing } = require('./lib/imageSets.js');
const { saveImage, getImage } = require('./lib/connectWithFileSystem');
const { resizeImage } = require('./lib/resizeImage');

const getJob = () => {
  return new Promise((resolve, reject) => {
    redisClient.blpop('resize_queue', 1, (err, res) => {
      if (res) resolve(res[1]);
      else reject('no job');
    });
  });
};

const runLoop = () => {
  getJob()
    .then((id) => {
      get(redisClient, id)
        .then((jobDetails) => {
          getImage(jobDetails.file_name)
            .then(resizeImage)
            .then((image) => saveImage(image, jobDetails.file_name))
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
