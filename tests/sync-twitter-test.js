var fakeweb = require(__dirname + '/fakeweb.js');
var twitter = require('../Connectors/Twitter/sync');
var assert = require("assert");
var vows = require("vows");
var fs = require("fs");
var rimraf = require("rimraf");

vows.describe("Twitter sync").addBatch({
    "Can get timeline" : {
        topic: function() {
            fakeweb.allowNetConnect = false;
            twitter.init({consumerKey : 'abc', consumerSecret : 'abc', token: {'oauth_token' : 'abc', 'oauth_token_secret' : 'abc'}}, this.callback); },
        "after setting up": {
            topic: function() {
                fakeweb.registerUri({
                    uri : "https://api.twitter.com:443/1/statuses/home_timeline.json?count=200&page=1&include_entities=true",
                    file : __dirname + '/fixtures/twitter/home_timeline.js' });
                fakeweb.registerUri({
                    uri : "https://api.twitter.com:443/1/statuses/home_timeline.json?count=200&page=2&include_entities=true&max_id=71348168469643260",
                    body : '[]' });
                twitter.pullStatuses("home_timeline", this.callback); },
            "successfully": function(err, response) {
                assert.equal(response, 1);
                fs.unlink("current.db");
                rimraf.sync("followers");
                rimraf.sync("friends");
                rimraf.sync("home_timeline");
                rimraf.sync("mentions");
                fs.unlink("latests.json");
            }
        }
    }
}).export(module);