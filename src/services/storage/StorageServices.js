const fs = require('fs').promises;

class StorageService {
  constructor(folder) {
    this._folder = folder;

    fs.mkdir(folder, { recursive: true }).catch((error) => {
      console.error('Failed to create folder:', error);
    });
  }

  get folder() {
    return this._folder;
  }

  async writeFile(file, meta) {
    const filename = +new Date() + `_${meta.filename}`;
    const path = `${this._folder}/${filename}`;
    try {
      await fs.writeFile(path, file);
      return filename;
    } catch (error) {
      throw error;
    }
  }

  async deleteFile(url) {
    const filename = url.split('/').pop();
    const path = `${this._folder}/${filename}`;
    try {
      await fs.unlink(path);
      console.log('File deleted successfully:', filename);
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  }
}

module.exports = StorageService;
