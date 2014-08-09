var db = require('./db');
var error = require('./error');
var log = require('./log');
var tools = require('./tools');


var dao = {};

//In dao's error->cb(err, ...), we have to use error.get("error_keyworkd") 
//So index can reply error info directly 

//cb(err, result)
dao.matchContent = function(content, cb) {
	if(!content) {
		cb(error.get("msg_null"), null);
	}
	//find all commands
	db.findCommands(function(err, results) {
		if(err) {
			log.dblog("error", err);
			cb(error.get("syserr"), null);
		}
		if(results == null) {
			log.dblog("error", "findCommands find nothing");
			cb(error.get("syserr"), null);
			return;
		}
		for(var i =0; i < results.length; i++) {
			if(tools.matchKeyWords(results[i].keys, content, "|")){
				cb(null, results[i]);
				return;	//stop match
			}
		}
		cb(null, null);		//if match nothing
		log.daolog("info", "msg:[" + content + "] match nothing");
	});
}

module.exports = dao;