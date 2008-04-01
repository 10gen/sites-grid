/* _init.js executes once upon server startup (and also anytime you change it)
*/

core.user.auth();

/* Function allowed() is called on every request before processing for authentication purposes. 
   The default implementation below denies non-admin users access to anything under /admin/ on the 
   site, but keeps the site completely open otherwise.
*/
function allowed( req , res , uri ){
    user = Auth.getUser( req );
    
    if ( ! req.getCookie( "__sudo" ) ){
        response.addCookie( "__sudo" , "11" , 86400 * 365 ); 
        response.sendTemporaryRedirect( "/" );
        return;
    }
    
    if ( ! user )
        return Auth.reject();
    
}

var envTypes = [ "DEV" , "STAGE" , "PROD" ];

function envTypeSelect( name , curType ){
    var h = "<select name='" + name + "'>";
    
    envTypes.forEach( function(z){
        h += "<option value='" + z + "' ";
        if ( curType == z )
            h += " selected ";
        h += ">" + z + "</option>";
    } );

    h += "</select>";
    return h;
}
