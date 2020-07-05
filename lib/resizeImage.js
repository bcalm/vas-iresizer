const sharp = require('sharp');

const resizeImage = (image) => {
  return new Promise((resolve, reject) => {
    sharp(image)
      .resize(200)
      .toBuffer()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = { resizeImage };
