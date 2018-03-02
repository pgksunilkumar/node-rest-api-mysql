var express = require('express');

module.exports = (function() {

	var router = express.Router();
	var Sequelize = require('sequelize');
	var db = require('./db');

	//Initialize database
	var sequelize = new Sequelize(db.database, db.username, db.password);
	var TABLE_PREFIX = db.table_prefix;

	//Pagination settings
	var paginate = db.paginate;
	var page_limit = db.page_limit;

	var mysql_clean = function (string) {
		return sequelize.getQueryInterface().escape(string);
	};

	//Create 
	router.post('/:table', function(req, res) {
		if(JSON.stringify(req.body) == '{}') {
			res.status(404);
			res.json({
				"success" : 0,
				"message" : "Parameters missing"
			});
			return false;
		}
		var keys = '';
		var values = '';
		Object.keys(req.body).forEach(function(key, index) {
			var val = req.body[key];
			keys += "`"+key+"`";
			values += mysql_clean(val);
			if(Object.keys(req.body).length != (index+1)) {
				keys += ',';
				values += ',';
			}
		});
		sequelize.query("INSERT INTO `" + ( TABLE_PREFIX + req.params.table ) + "` (" + keys + ") VALUES ("+ values +")", { type: sequelize.QueryTypes.INSERT})
		.then(function(id) {
			res.status(201);
			res.json({
				"success" : 1,
				"id" : id
			});
		})
		.catch( function(err) {
			res.status(404);
			res.send({
				"success" : 0,
				"message" : err.message
			});
		});
	});


	//Read 
	router.get('/:table', function(req, res) {
		if(paginate) {
			var page = 1;
			if(req.query.page)
				page = req.query.page;
			var offset = (page-1) * page_limit;

			//Calculate pages
			var next = Number(page)+1;
			if(page != 1)
				var previous = Number(page)-1;
			else
				var previous = Number(page);

			var read_query = "SELECT * FROM `" + ( TABLE_PREFIX + req.params.table ) + "` LIMIT "+page_limit+" OFFSET "+offset;
		} else {
			var read_query = "SELECT * FROM `" + ( TABLE_PREFIX + req.params.table ) + "`";
		}
		sequelize.query(read_query, { type: sequelize.QueryTypes.SELECT})
		.then(function(rows) {
			if(!rows.length) {
				res.status(404);
				res.json({
					"success" : 0,
					"data" : "No rows found"
				});
			}
			res.status(200);
			if(!next)
				res.json({
					"success" : 1,
					"data" : rows
				});
			else
				var last = Math.ceil(rows.length/page_limit);
			res.json({
				"success" : 1,
				"data" : rows 
			});
		})
		.catch( function(err) {
			res.status(404);
			res.send({
				"success" : 0,
				"message" : err.message
			});
		});
	});

	return router;

})();