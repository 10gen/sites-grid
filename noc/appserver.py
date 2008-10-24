# appserver.py

from tests import Test
from results import Result
import _10gen

class AppServerTest(Test):
    def __init__(self,server,code):
        Test.__init__(self,"as",server)
        self.server = server
        self.code = code

    def doRun(self):
        r = Result()
        
        return { "stats" : self.getJSON( "stats" ) ,
                 "mem" : self.getJSON( "mem" ) }

    
    def getJSON(self,type):
        x = _10gen.XMLHttpRequest( "GET" , "http://" + self.server + ":8080/~" + type + "?json=true&auth=" + self.code )
        if not x.send():
            return Exception( "couldn't get [" + type + "] from [" + self.server + "]" )
        return x.getJSON()        
