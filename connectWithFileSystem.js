const http = require('http');

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
    req.write(image);
    req.end();
  });
};

module.exports = { saveImage, getImage };
