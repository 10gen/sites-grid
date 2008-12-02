/* _init.js executes once upon server startup (and also anytime you change it)
*/

core.user.auth();
core.util.diff();
core.content.table();

/**
* this is because we use the sudo hack below
*/
User.getSiteName = function(){
    return "admin";
}

/* Function allowed() is called on every request before processing for authentication purposes. 
   The default implementation below denies non-admin users access to anything under /admin/ on the 
   site, but keeps the site completely open otherwise.
*/
function allowed( req , res , uri ){
    
    if ( uri.startsWith( "/api" ) )
	return;

    if ( req.getHeader( "X-SSL" ) != "js81" && req.getHost() == "grid.10gen.com" ){
	response.sendRedirectPermanent( "https://" + req.getHost() + uri );
	return;
    }
    CDN = "";
    
    if ( uri.match( /\.(jpg|gif|js)$/ ) )
        return;
    
    user = Auth.getUser( req );
    
    if ( ! req.getCookie( "__sudo" ) ){
        response.addCookie( "__sudo" , "11" , 86400 * 365 ); 
        response.sendRedirectPermanent( "/" );
        return;
    }
    
    
    if ( ! hasValidAdminConfig() ){
        // so there is a db, but nothing in it
        // i'm assuming we're in initial config
        initialConfig = true;
        return null;
    }
    
    if ( user )
        return null;

    return Auth.reject();
}

function hasValidAdminConfig(){
    var a = db.sites.findOne( { name : "admin" } );
    if ( ! a )
        return false;
    
    return a.dbs.length > 0 && a.environments.length > 0;
}

var envTypes = [ "PROD" , "TEST" , "DEV" , "BACKUP" , "STAGE" ];

function envTypeSelect( name , curType ){
    return selectBox( name , envTypes , curType );
}

function selectBox( name , choices , current ){
    var h = "<select name='" + name + "'>";
    
    choices.forEach( function(z){
        var name = z;
        var display = name;

        if ( isObject( name ) ){
            name = z.name;
            if ( z.display )
                display = z.display;
        }
        
        h += "<option value='" + name + "' ";
        if ( current == name )
            h += " selected ";
        h += ">" + display + "</option>";
    } );

    h += "</select>";
    return h;    
}

ConfigChange = function( o , n ){

    if ( ! o )
        this.bad = true;

    this.what = o._id;    
    this.diff = Util.Diff.diff( o , n );

    this.ts = new Date();
    this.user = user ? user.email : "initial config";

    assert( this.user );
    assert( o._id == n._id );
}

ConfigChange.prototype.save = function(){
    if ( this.bad )
        return;
    if ( this.diff.keySet().size() == 0 )
        return;
    db.changes.save( this );
}

db.changes.ensureIndex( { ts : 1 } );

resetSiteOnPool = function( pool , hostName , command ){
    command = command || "reset";

    var res = { ok : true };

    var p = db.pools.findOne( { name : pool } );
    if ( ! p ){
	res.ok = false;
	res.msg = "couldn't find pool : " + pool;
	return res;
    }
    
    var threads = [];

    p.machines.forEach( 
	function(z){
	    threads.push(
		fork( 
		    function(){
			try {
			    res[z] = resetSiteOnHost( z , hostName , command );
			}
			catch ( e ){
			    res.ok = false;
			    res[z] = e;
			}
		    }
		)
	    )
	}
    );

    threads.forEach( function(z){ z.start(); } );
    threads.forEach( function(z){ z.join(); } );

    return res;
}

resetSiteOnHost = function( machine , hostName , command ){
    command = command || "reset";
    var cmd = "ssh " + machine + " \"curl -D - -s -H 'Host: " + hostName + "'\" 127.0.0.1:8080/~" + command;
    var res = sysexec( cmd );
    return res;
}

routes = null;

User.requirements = {};


externalDomain = javaStatic( "ed.util.Config" , "getExternalDomain" );
internalDomain = javaStatic( "ed.util.Config" , "getInternalDomain" );

serverNamesToLinks = function( servers , port , url ){
    if ( isString( servers ) )
	servers = [ servers ];

    var html = "";
    for each ( var s in servers ){
	var orig = s;

	if ( s.indexOf( ":" ) > 0 ){
	    port = s.substring( s.indexOf( ":" ) + 1 );
	    s = s.substring( 0 , s.indexOf( ":" ) );
	}
	
	if ( s.indexOf( "." ) < 0 )
	    s += "." + internalDomain;
	
	if ( html.length )
	    html += " , ";
	html += makeLink( "http://" + s + ":" + port + "/" + ( url || "" ) , orig );
    }
    return html
}

makeLink = function( href , name ){
    name = name || href;
    return "<a href='" + href + "'>" + name + "</a>";
}

