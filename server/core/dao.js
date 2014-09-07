
var _ = require("underscore");

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
		return;
	}
	//find all commands
	db.findCommands(function(err, results) {
		if(err) {
			log.dblog("error", err);
			cb(error.get("syserr"), null);
			return
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


dao.getList = function(cb) {
	db.findList(function(err, results) {
		if(err) {
			log.dblog("error", err);
			cb(error.get("syserr"), null);
			return;
		}
		
		for(var i = 0; i < results.length; i++){
			var items = new Array();
			results[i].items = items;
			
			for(var j = 0; j < results[i].list.length; j++){
				items.push(setItems(results[i].list[j]));
			}
			
		}
		
		cb(null, results);
	});
}


/*
what a fuck function, if not used it, item["val"] would not work!
*/
function setItems (item) {
	var result = new Array(2);
	result[0] = item["key"];
	result[1] = function (info, req, res) {
		eval(item["val"]);
	};
	return result;
}

module.exports = dao;