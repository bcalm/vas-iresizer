const sharp = require('sharp');

const fs = require('fs');
const resizeImage = (image) => {
  fs.writeFileSync('rtemp.png', image);
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
