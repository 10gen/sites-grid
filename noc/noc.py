
from fields import *
from results import *
from tests import *

class Noc:
    def __init__(self):
        self._types = {}

    def add( self , test ):
        
        if not test.getType() in self._types :
            self._types[ test.getType() ] = set()
            
        self._types[test.getType()].add( test )
        return len( self._types[test.getType()] )
    
    def getTypes(self):
        return self._types.keys()

    def getForType(self,type):
        return self._types[type]

    def __str__(self):
        return "Noc"

