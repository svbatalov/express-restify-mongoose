var assert = require('assert')
var request = require('request')
var util = require('util')

module.exports = function (createFn, setup, dismantle) {
  var erm = require('../../lib/express-restify-mongoose')
  var db = require('./setup')()

  var testPort = 30023
  var testUrl = 'http://localhost:' + testPort

  describe('no options', function () {
    var app = createFn()
    var server

    before(function (done) {
      setup(function (err) {
        if (err) {
          return done(err)
        }

        erm.defaults({
          restify: app.isRestify
        })

        erm.serve(app, db.models.Customer)

        server = app.listen(testPort, done)
      })
    })

    after(function (done) {
      dismantle(app, server, done)
    })

    it('GET /Customers 200', function (done) {
      request.get({
        url: util.format('%s/api/v1/Customers', testUrl)
      }, function (err, res, body) {
        assert.ok(!err)
        assert.equal(res.statusCode, 200)
        done()
      })
    })
  })

  describe('defaults', function () {
    var app = createFn()
    var server

    before(function (done) {
      setup(function (err) {
        if (err) {
          return done(err)
        }

        erm.defaults({
          lowercase: true,
          plural: false
        })

        erm.serve(app, db.models.Customer, {
          restify: app.isRestify
        })

        server = app.listen(testPort, done)
      })
    })

    after(function (done) {
      erm.defaults({
        lowercase: false,
        plural: true
      })

      dismantle(app, server, done)
    })

    it('GET /Customer 200 - plural and lowercase set in defaults', function (done) {
      request.get({
        url: util.format('%s/api/v1/customer', testUrl)
      }, function (err, res, body) {
        assert.ok(!err)
        assert.equal(res.statusCode, 200)
        done()
      })
    })
  })

  describe('lowercase', function () {
    var app = createFn()
    var server

    before(function (done) {
      setup(function (err) {
        if (err) {
          return done(err)
        }

        erm.serve(app, db.models.Customer, {
          lowercase: true,
          restify: app.isRestify
        })

        server = app.listen(testPort, done)
      })
    })

    after(function (done) {
      dismantle(app, server, done)
    })

    it('GET /customers 200', function (done) {
      request.get({
        url: util.format('%s/api/v1/customers', testUrl)
      }, function (err, res, body) {
        assert.ok(!err)
        assert.equal(res.statusCode, 200)
        done()
      })
    })

    it('GET /Customers 200 (Express), 404 (Restify)', function (done) {
      request.get({
        url: util.format('%s/api/v1/Customers', testUrl)
      }, function (err, res, body) {
        assert.ok(!err)
        if (app.isRestify) {
          assert.equal(res.statusCode, 404)
        } else {
          assert.equal(res.statusCode, 200)
        }
        done()
      })
    })
  })

  describe('name', function () {
    var app = createFn()
    var server

    before(function (done) {
      setup(function (err) {
        if (err) {
          return done(err)
        }

        erm.serve(app, db.models.Customer, {
          name: 'Client',
          restify: app.isRestify
        })

        server = app.listen(testPort, done)
      })
    })

    after(function (done) {
      dismantle(app, server, done)
    })

    it('GET /Clients 200', function (done) {
      request.get({
        url: util.format('%s/api/v1/Clients', testUrl)
      }, function (err, res, body) {
        assert.ok(!err)
        assert.equal(res.statusCode, 200)
        done()
      })
    })
  })

  describe('plural', function () {
    var app = createFn()
    var server

    before(function (done) {
      setup(function (err) {
        if (err) {
          return done(err)
        }

        erm.serve(app, db.models.Customer, {
          plural: false,
          restify: app.isRestify
        })

        server = app.listen(testPort, done)
      })
    })

    after(function (done) {
      dismantle(app, server, done)
    })

    it('GET /Customer 200', function (done) {
      request.get({
        url: util.format('%s/api/v1/Customer', testUrl)
      }, function (err, res, body) {
        assert.ok(!err)
        assert.equal(res.statusCode, 200)
        done()
      })
    })
  })
}
