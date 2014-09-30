'use strict';

var assert = require('node-assertthat');

var shaker = require('../lib/shaker');

suite('shaker', function () {
  suite('generate', function () {
    test('runs callback.', function (done) {
      shaker.generate('', function () {
        done();
      });
    });

    test('creates a random 128 characters salt.', function (done) {
      shaker.generate('', function (err, salt) {
        assert.that(err, is.null());
        assert.that(salt, is.ofType('string'));
        assert.that(salt.length, is.equalTo(128));
        done();
      });
    });

    test('calculates a 64 hex-characters hash.', function (done) {
      shaker.generate('', function (err, salt, hash) {
        assert.that(err, is.null());
        assert.that(hash, is.ofType('string'));
        assert.that(/^[0-9a-f]{64}$/i.test(hash), is.true());
        done();
      });
    });
  });

  suite('verify', function () {
    test('returns false when password, salt and hash do not match each other.', function (done) {
      shaker.verify('secret', 'this is an invalid salt', 'this is an invalid hash', function (err, verified) {
        assert.that(err, is.null());
        assert.that(verified, is.false());
        done();
      });
    });

    test('returns false when the password does not match the given salt and hash.', function (done) {
      shaker.generate('secret', function (err, salt, hash) {
        assert.that(err, is.null());
        shaker.verify('another secret', salt, hash, function (err, verified) {
          assert.that(err, is.null());
          assert.that(verified, is.false());
          done();
        });
      });
    });

    test('returns true when password, salt and hash match each other.', function (done) {
      shaker.generate('secret', function (err, salt, hash) {
        assert.that(err, is.null());
        shaker.verify('secret', salt, hash, function (err, verified) {
          assert.that(err, is.null());
          assert.that(verified, is.true());
          done();
        });
      });
    });
  });
});
