const sharp = require('sharp');

const resize = (image, width, height) => {
  return new Promise((resolve, reject) => {
    sharp(image)
      .resize(width, height)
      .toBuffer()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = resize;
