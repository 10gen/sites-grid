var site = arguments[0];
return site.dbs.map( 
    function(db){
	return db.name;
    }
);