
from noc import *

assert( Status.OK < Status.FATAL )
assert( Status.ERROR > Status.WARNING )

nf = NumericField( "cpu" , [ ( 0 , 10 , Status.OK ) ,
                             ( 10 , 20 , Status.WARNING ) ,
                             ( 20 , 30 , Status.ERROR ) ,
                             ( 30 , 1000 , Status.FATAL )
                             ]
                   )

assert( Status.OK == nf.getStatus( 0 ) );
assert( Status.OK == nf.getStatus( 5 ) );
assert( Status.OK == nf.getStatus( 10 ) );
assert( Status.WARNING == nf.getStatus( 11 ) );
assert( Status.FATAL == nf.getStatus( 35 ) );

ok = True
try:
    print( nf.getStatus( -5 ) )
    ok = False
except:
    ok = True
assert( ok )

assert( Status.OK == nf.getResult( 5 ).status )
assert( "cpu" == nf.getResult( 5 ).name )

n = Noc()
assert( 1 == n.add( Test( "blah" , "a" ) ) )
assert( 2 == n.add( Test( "blah" , "b" ) ) )
t = Test( "blah" , "c" )
assert( 3 == n.add( t ) )
assert( 3 == n.add( t ) )

assert( t.shouldRun() )
ok = False
try:
    t.run()
except:
    ok = True
assert( ok )
assert( not t.shouldRun() )

print( "OK" )
