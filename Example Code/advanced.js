var r = require('rethinkdb'),
    rConfig = require('./config.json');

// Our Search Perameters
var search = {
	id:'Bat',
	gender:'male'
};

r.connect(rConfig, function(connErr, conn){
	if(connErr){
		throw new Error(connErr);
	}
	r.table("heros").filter(function(hero){
		return r.expr(search).keys().map(function(key){
			return hero(key).match(r.expr("(?i)").add(r.expr(search)(key))).ne(null)
		}).reduce(function(left, right){
			return left.and(right)
		});
	}).orderBy(r.asc('id')).coerceTo("array").run(conn, function(reqlErr, heros){
		conn.close(); // close the connection
		if(reqlErr){ throw new Error(reqlErr); }

		console.log(heros);
	});
});