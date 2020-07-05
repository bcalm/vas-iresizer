const http = require('http');
const fs = require('fs');

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

const saveImage = (image, fileName) => {
  return new Promise((resolve, reject) => {
    const options = getFileSystemOptions();
    options.path = '/save';
    options.method = 'POST';
    const ext = fileName.split('.')[1];
    options.headers = { 'Content-Type': `image/${ext}` };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve(data);
      });
    });
    req.write(image);
    req.end();
  });
};

module.exports = { saveImage, getImage };
