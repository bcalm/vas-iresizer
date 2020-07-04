const completeProcessing = (client, id, fileName) => {
  const statusDetails = ['status', 'completed'];
  const completionDetails = ['completedAt', new Date()];
  const fileDetails = ['resizedFile', fileName];
  const details = statusDetails.concat(fileDetails, completionDetails);
  return new Promise((resolve, rej) => {
    client.hmset(`job_${id}`, details, (err, res) => {
      resolve(res);
    });
  });
};

const get = (client, id) => {
  return new Promise((resolve, rej) => {
    client.hgetall(`job_${id}`, (err, res) => {
      resolve(res);
    });
  });
};

module.exports = { get, completeProcessing };
