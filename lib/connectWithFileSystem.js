const http = require('http');

const getFileSystemOptions = () => ({
  port: 5000,
  host: 'localhost',
});

const getImage = (fileName) => {
  return new Promise((resolve, reject) => {
    const options = getFileSystemOptions();
    options.path = `/get/${fileName}`;
    const req = http.request(options, (res) => {
      const data = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => {
        resolve(Buffer.concat(data));
      });
    });
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
    req.write(image);
    req.end();
  });
};

module.exports = { saveImage, getImage };
