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
