const completeProcessing = (client, id, resultantFileName) => {
  const statusDetails = ['status', 'completed'];
  const completionDetails = ['completedAt', JSON.stringify(new Date())];
  const fileDetails = ['resultedFileName', resultantFileName];
  const details = statusDetails.concat(fileDetails, completionDetails);
  return new Promise((resolve, rej) => {
    client.hmset(id, details, (err, res) => {
      resolve(res);
    });
  });
};

const getJob = (client, queue) => {
  return new Promise((resolve, reject) => {
    client.blpop(queue, 1, (err, res) => {
      if (res) {
        const jobId = res[1];
        client.hset(jobId, 'poppedFromQueueAt', JSON.stringify(new Date()));
        resolve(jobId);
      } else {
        reject('no job');
      }
    });
  });
};

const get = (client, queue) => {
  return new Promise((resolve, reject) => {
    getJob(client, queue)
      .then((id) => {
        console.log(`Picked: ${id}`);
        client.hgetall(id, (err, res) => {
          res.id = id;
          resolve(res);
        });
      })
      .catch((err) => reject(err));
  });
};

module.exports = { get, completeProcessing };
