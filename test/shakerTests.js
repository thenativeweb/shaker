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

    test('calculates a 64 bytes long key.', function (done) {
      shaker.generate('', function (err, salt, key) {
        assert.that(err, is.null());
        assert.that(key, is.ofType('string'));
        assert.that(key.length, is.equalTo(64));
        done();
      });
    });
  });

  suite('verify', function () {
    test('returns false when password, salt and key do not match each other.', function (done) {
      shaker.verify('secret', 'this is an invalid salt', 'this is an invalid key', function (err, verified) {
        assert.that(err, is.null());
        assert.that(verified, is.false());
        done();
      });
    });

    test('returns false when the password does not match the given salt and key.', function (done) {
      shaker.generate('secret', function (err, salt, key) {
        assert.that(err, is.null());
        shaker.verify('another secret', salt, key, function (err, verified) {
          assert.that(err, is.null());
          assert.that(verified, is.false());
          done();
        });
      });
    });

    test('returns true when password, salt and key match each other.', function (done) {
      shaker.generate('secret', function (err, salt, key) {
        assert.that(err, is.null());
        shaker.verify('secret', salt, key, function (err, verified) {
          assert.that(err, is.null());
          assert.that(verified, is.true());
          done();
        });
      });
    });
  });
});
