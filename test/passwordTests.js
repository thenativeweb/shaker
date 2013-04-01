'use strict';

var assert = require('node-assertthat');

var password = require('../lib/password');

suite('password', function () {
  suite('generate', function () {
    test('runs callback.', function (done) {
      password.generate('', function () {
        done();
      });
    });

    test('creates a random 100 characters salt.', function (done) {
      password.generate('', function (salt) {
        assert.that(salt, is.ofType('string'));
        assert.that(salt.length, is.equalTo(100));
        done();
      });
    });

    test('calculates a 64 hex-characters hash.', function (done) {
      password.generate('', function (salt, hash) {
        assert.that(hash, is.ofType('string'));
        assert.that(/^[0-9a-f]{64}$/i.test(hash), is.true());
        done();
      });
    });
  });

  suite('verify', function () {
    test('returns false when password, salt and hash do not match each other.', function () {
      var result = password.verify('secret', 'this is an invalid salt', 'this is an invalid hash');
      assert.that(result, is.false());
    });

    test('returns false when the password does not match the given salt and hash.', function (done) {
      password.generate('secret', function (salt, hash) {
        var result = password.verify('another secret', salt, hash);
        assert.that(result, is.false());
        done();
      });
    });

    test('returns true when password, salt and hash match each other.', function (done) {
      password.generate('secret', function (salt, hash) {
        var result = password.verify('secret', salt, hash);
        assert.that(result, is.true());
        done();
      });
    });
  });
});