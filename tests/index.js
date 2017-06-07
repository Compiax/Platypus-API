var PlatypusApi    = require('../core');
var config          = require('config');
var e2e             = require('./e2e');
var helpers         = require('./helpers');

/**
 * Adjust config to cater for testing environment.
 */
config.servers.db.database += '-test';
config.servers.http.port = parseInt(config.servers.http.port) + 1;

var PlatypusApi = new PlatypusApi(config);

describe('tests =>', function() {
  var app = PlatypusApi.app;

  e2e.test(app);
  helpers.test();
});
