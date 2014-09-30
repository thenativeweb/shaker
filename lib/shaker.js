'use strict';

var crypto = require('crypto');

var calculateKey = function (password, salt, callback) {
  crypto.pbkdf2(password, salt, 65536, 64, function (err, derivedKey) {
    if (err) {
      return callback(err);
    }

    callback(null, derivedKey.toString('ascii'));
  });
};

var shaker = {
  generate: function (password, callback) {
    crypto.randomBytes(128, function (err, buffer) {
      var salt;

      if (err) {
        return callback(err);
      }

      salt = buffer.toString('ascii');

      calculateKey(password, salt, function (err, derivedKey) {
        if (err) {
          return callback(err);
        }

        callback(null, salt, derivedKey);
      });
    });
  },

  verify: function (password, salt, key, callback) {
    setTimeout(function () {
      calculateKey(password, salt, function (err, derivedKey) {
        if (err) {
          return callback(err);
        }

        callback(null, key === derivedKey);
      });
    }, 250);
  }
};

module.exports = shaker;
