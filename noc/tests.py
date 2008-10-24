
import time

class Test:
    def __init__(self,type,name,secondsBetweenRuns=60):
        self.type = type
        self.name = name
        self._seconds = secondsBetweenRuns
        self._lastRun = 0
        
    def getType(self):
        return self.type

    def getName(self):
        return self.name


    def run(self):
        try:
            return self.doRun()
        finally:
            self._lastRun = time.time()

    def doRun(self):
        '''
            actual tests should override this
            actually run the test. should be synchronous
            should return a Result
            '''
        raise Exception( "need to implement doRun for Test type [" + self.type + "]" )
    
    def shouldRun(self):
        return time.time() - self._lastRun >= self._seconds

    def __str__(self):
        return "( NocTest type [" + self.type + "] name[" + self.name + "] ) "

    def __eq__(self,other):
        return self.type == other.getType() and self.name == other.getName()
    
    def __hash__(self):
        return self.name.__hash__()

