const sharp = require('sharp');

const rotate = (image, angle) => {
  return new Promise((resolve, reject) => {
    sharp(image)
      .rotate(angle)
      .toBuffer()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = rotate;
