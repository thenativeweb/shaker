'use strict';

var crypto = require('crypto');

var calculateHash = function (password, salt) {
  var sha256 = crypto.createHash('sha256');

  sha256.update(salt);
  sha256.update(password);
  
  return sha256.digest('hex');
};

var password = {
  generate: function (password, callback) {
    crypto.randomBytes(100, function (err, buffer) {
      var salt = buffer.toString('ascii'),
          hash = calculateHash(password, salt);

      callback(salt, hash);
    });
  },

  verify: function (password, salt, hash) {
    return hash === calculateHash(password, salt);
  }
};

module.exports = password;