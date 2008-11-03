// nodePicker.js

var name = arguments[0] || "node";
var multiple = arguments[1];
var alreadyPicked = arguments[2];

if ( isString( alreadyPicked ) )
    alreadyPicked = alreadyPicked.split( /[ ,]+/ );

var nodes = _cachedNodes;

if ( ! nodes ){
    nodes = {};
    db.nodes.find().forEach( 
        function(z){
            var s = new Cloud.Server( z.machine );
            
            if ( ! s.real )
                return;
            
            var providers = nodes[s.location];
            if ( ! providers ){
                providers = {};
                nodes[s.location] = providers;
            }
            
            var numbers = providers[s.provider];
            if ( ! numbers ){
                numbers = [];
                providers[s.provider] = numbers;
            }
            
            numbers.add( s.number  );
        }
    );
    _cachedNodes = nodes;
}

print( "<ul>" );
for each ( var locName in nodes.keySet().sort() ){

    print( "<li>" + locName );
    var loc = nodes[locName];
    
    print( "<ul>" );
    for each ( var providerName in loc.keySet().sort() ){
        print( "<li>" + providerName );
        var provider = loc[providerName];
        
        var all = provider.map( Number ).sort( 
            function( a , b ){
                return a - b;
            }
        );

        print( "<ul>" );
        for each ( var num in all ){
            print( "<li>" );
            var fullName = locName + "-" + providerName + "-n" + num;

            print( "<input " );
            if ( multiple )
                print( " type='checkbox' " );
            else
                print( " type='radio' " );
            
            print( " name='" + name + "' value=\"" + fullName + "\" " );
            
            if ( alreadyPicked && alreadyPicked.contains( fullName ) )
                print( " checked " );
            
            print( " >" );
            
            print( fullName );
            print( "</li>" );
        }
        print( "</ul>" );
        
        print( "</li>" );
        
    }
    print( "</ul>" );
    print( "</li>" );
}
print( "</ul>" );
