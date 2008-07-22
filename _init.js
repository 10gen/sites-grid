/* _init.js executes once upon server startup (and also anytime you change it)
*/

core.user.auth();
core.util.diff();

/* Function allowed() is called on every request before processing for authentication purposes. 
   The default implementation below denies non-admin users access to anything under /admin/ on the 
   site, but keeps the site completely open otherwise.
*/
function allowed( req , res , uri ){
    if ( req.getHeader( "X-SSL" ) != "js81" ){
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
    
    if ( ! user )
        return Auth.reject();
    
}

var envTypes = [ "DEV" , "TEST" , "BACKUP" , "STAGE" , "PROD" ];

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
    this.user = user.email;

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
    var cmd = "ssh " + machine + " \"curl -D - -s -H 'Host: " + hostName + "'\" local.10gen.com:8080/~" + command;
    var res = sysexec( cmd );
    return res;
}