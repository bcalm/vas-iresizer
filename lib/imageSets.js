const completeProcessing = (client, id, fileName) => {
  const statusDetails = ['status', 'completed'];
  const completionDetails = ['completedAt', JSON.stringify(new Date())];
  const fileDetails = ['resulted_fileName', fileName];
  const details = statusDetails.concat(fileDetails, completionDetails);
  return new Promise((resolve, rej) => {
    client.hmset(id, details, (err, res) => {
      resolve(res);
    });
  });
};

const get = (client, id) => {
  return new Promise((resolve, rej) => {
    client.hgetall(id, (err, res) => {
      resolve(res);
    });
  });
};

module.exports = { get, completeProcessing };
