var r = require('rethinkdb'),
	async = require('async'),
    rConfig = require('./config.json');

var heroes = require('./data/heroes.json'),
	villans = require('./data/villans.json');

console.log('Connecting to RethinkDB Database.');
r.connect(rConfig, function(connErr, conn){
	if(connErr){
		throw new Error(connErr);
	}
	console.log('Connected.');
	async.series([
		function(cb){
			console.log('Creating heros table');
			r.tableCreate('heroes').run(conn, cb);
		},
		function(cb){
			console.log('Creating villans table');
			r.tableCreate('villans').run(conn, cb);
		},
		function(cb){
			console.log('Inserting into heroes table.');
			r.table('heroes').insert(heroes).run(conn, cb);
		}, function(cb){
			console.log('Inserting into villans table.');
			r.table('villans').insert(villans).run(conn, cb);
		}
	], function(err, data){
		if(err){
			throw new Error(err);
		}
		console.log('Insert Results', data);
		conn.close();
	});
});
