request.applyServletParams( /api\/(\w+)/ , [ "command"] );

var command = {
    name : request.command ,
    key : request.key ,
    siteName : request.site 
};

function error( txt ){
    return { "$err" : txt };
}

function process( command ){
    
    if ( ! command.name )
	return error( "need a command" );
    if ( ! command.siteName )
	return error( "need a site name" );
    if ( ! command.key )
	return error( "need an API key" );

    command.site = db.sites.findOne( { name : command.siteName } );
    if ( ! command.site )
	return error( "invalid site" );
    
    if ( ! command.site.apiKeys )
	return error( "no api keys" );
    
    var key = null;
    for each ( var k in command.site.apiKeys ){
	if ( k.key == command.key ){
	    key = k;
	    break;
	}
    }
    
    if ( ! key )
	return error( "can't find key" );
    
    var script = local.$.commands[command.name];
    if ( ! script )
	return error( "invalid command" );
   
    var res = script( command.site );
    if ( ! isObject( res ) )
	return { result : res };
    return res;
}

var result = process( command );

if ( request.json ){
    response.setContentType( "application/json" );
    print( tojson( result ) );
}
else {
    response.setContentType( "text/plain" );
    print( "command: " + command.name + "\n" );
    // TODO: make prettier
    print( tojson( result ) );
}
print( "\n" );