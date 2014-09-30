'use strict';

var crypto = require('crypto');

var calculateHash = function (password, salt) {
  var sha256 = crypto.createHash('sha256');

  sha256.update(salt);
  sha256.update(password);

  return sha256.digest('hex');
};

var shaker = {
  generate: function (password, callback) {
    crypto.randomBytes(128, function (err, buffer) {
      var hash,
          salt;

      if (err) {
        return callback(err);
      }

      salt = buffer.toString('ascii');
      hash = calculateHash(password, salt);

      callback(null, salt, hash);
    });
  },

  verify: function (password, salt, hash, callback) {
    setTimeout(function () {
      callback(null, hash === calculateHash(password, salt));
    }, 250);
  }
};

module.exports = shaker;
