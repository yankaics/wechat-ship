var dbRegex = require('../db/regex.js');
var assert = require('assert');
var should = require('should');

describe('regex', function() {
	it('read', function(done) {
		dbRegex.read({"title": "default_regex"}, 
			function (err, result) {
				result.should.have.property("title", "default_regex");

				done();
		});
	});
	it('save', function(done) {
		var value = {
			id: "default_id",
			title: "default_regex",
			regex: "/^\d+$/",
			code: "console.log('default regex has been save')"
		}
		dbRegex.save(value, 
			function (err, result) {
				result.should.have.property("id", "default_id");

				done();
		});
	});
});