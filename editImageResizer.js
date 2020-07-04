const redis = require('redis');
const redisClient = redis.createClient();
const sharp = require('sharp');

const completeProcessing = (id, fileName) => {
  const statusDetails = ['status', 'completed'];
  const completionDetails = ['completedAt', new Date()];
  const fileDetails = ['resizedFile', fileName];
  const details = statusDetails.concat(fileDetails, completionDetails);
  return new Promise((resolve, rej) => {
    redisClient.hmset(`job_${id}`, details, (err, res) => {
      resolve(res);
    });
  });
};

const get = (id) => {
  return new Promise((resolve, rej) => {
    redisClient.hgetall(`job_${id}`, (err, res) => {
      resolve(res);
    });
  });
};

const resizeImage = (image) => {
  return new Promise((resolve, reject) => {
    sharp(image)
      .resize(200)
      .toBuffer()
      .then((data) => {
        console.log(data, 'hello');
        resolve(data);
      })
      .catch((err) => {
        console.log(err, 'kaise ho sb');
        reject(err);
      });
  });
};

const getJob = () => {
  return new Promise((resolve, reject) => {
    redisClient.blpop('resizeQueue', 1, (err, res) => {
      console.log(res);
      if (res) resolve(res[1]);
      else reject('no job');
    });
  });
};

const getFileSystemOptions = () => ({
  port: 8000,
  host: 'localhost',
});

const getImage = (fileName) => {
  return new Promise((resolve, reject) => {
    const options = getFileSystemOptions();
    options.path = '/get';
    const req = http.request(options, (res, err) => {
      resolve(res);
    });
    req.write(JSON.stringify(fileName));
    req.end();
  });
};

const saveImage = (image) => {
  return new Promise((resolve, reject) => {
    const options = getFileSystemOptions();
    options.path = '/save';
    const req = http.request(options, (res, err) => {
      resolve(res);
    });
    req.write(fileName);
    req.end();
  });
};

const runLoop = () => {
  getJob()
    .then((id) => {
      get(id)
        .then((details) => {
          const jobDetails = JSON.parse(details);
          getImage(jobDetails.fileName)
            .then(resizeImage)
            .then(saveImage)
            .then((fileName) => completeProcessing(id, fileName));
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
