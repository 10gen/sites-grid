var shortName = arguments[0];
var longName = arguments[1];
var sortBy = arguments[2] || "name";
var extraFields = arguments[3];
var extraCols = arguments[4];

var coll = db[ shortName + "s" ];

var idxObject = {};
idxObject[sortBy] = 1;
coll.ensureIndex( idxObject );

var fields = [];

var foo = coll.findOne();
if ( foo ){
    if ( foo.name )
        fields.add( "name" );
}

if ( extraFields ){
    if ( isString( extraFields ) ){
	fields.add( extraFields );
    }
    else {
	for each ( var z in extraFields ){
	    fields.add( z );
	}
    }
}
    

var cols = [];
for each ( var f in fields ){
    cols.add( { name : f } );
}

if ( extraCols ){
    for each ( var z in extraCols ){
	cols.add( z );
    }
}

if ( request.action == "delete" && request._id ){
    var toDelete = coll.findOne( request._id );
    if ( toDelete ){
	coll.remove( toDelete );
	print( "deleted <b>" + tojson( toDelete ) + "</b>" );
    }
}

print( "<h1>" + longName + "s</h1><div class=\"container\">" );

var tab = new htmltable( 
    {
	ns : coll ,
	cols : cols ,
	detailUrl : "/" + shortName + "_edit?_id=" ,
	searchable : true ,
	actions : [ { name : "delete" } ] 
    }
);
tab.dbview( tab.find().sort( idxObject ) );

print( "<a href='" + shortName + "_edit'>Add <b>" + longName + "</b></a>" );
print( "</div>" );
