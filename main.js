var path = require("path");
var _ = require("underscore");
var url = require("url");
var open = require("open");

/*
 * get default configurations
 */
var client_defaults = require(path.join(__dirname, "./defaults/client.config.json"));
var server_defaults = require(path.join(__dirname, "./defaults/server.config.json"));
var defaults = _.extend(server_defaults, client_defaults);

/*
 * get actual configurations
 */
var config = _.extend(defaults, require(path.join(__dirname, "./config.json")));

/*
 * cluster must be managed by a pm manager
 */
config.cluster = false;

/*
 * run powa bundle
 */
require(path.resolve(__dirname, "./bundle/main.js"))(config);