const sharp = require('sharp');
const AppError = require('../utils/appError');
const cloudinary = require('../lib/cloudinary');

class FileService {
  async uploadToCloudinary({ buffer, folderToUpload }) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: folderToUpload,
            resource_type: 'auto'
          },
          (error, result) => {
            if (error) {
              reject(new AppError('Fail to upload to cloudinary', 500));
            } else {
              resolve(result.secure_url);
            }
          }
        )
        .end(buffer);
    });
  }

  async resizeImage(file, width = 500, height = 500) {
    const byteBufferArray = await sharp(file.buffer)
      .resize(width, height)
      .toFormat('jpg')
      .jpeg({ quality: 90 })
      .toBuffer();

    return byteBufferArray;
  }
}

module.exports = new FileService();
