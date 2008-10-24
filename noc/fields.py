
class Field:

    NUMERIC = 1
    
    def __init__(self,name,type):
        self.name = name
        self.type = type



class NumericField(Field):
    def __init__(self,name,ranges):
        '''
        ranges : tuples that give the status based on a range
                of the form ( 1 , 10 , Status.OK )
                uses >= <= in order they are passed in
                getStatus will throw an exception for a value not in a tuple
        '''
        Field.__init__(self,name,Field.NUMERIC)
        self.ranges = ranges

    def getStatus(self,value):
        for r in self.ranges:
            if value >= r[0] and value <= r[1]:
                return r[2]
        raise Exception( "can't find result for value [" + value + "]" )

    def getResult(self,value):
        return FieldResult(self.name,value,self.getStatus(value))

    

class FieldResult:
    def __init__(self,name,value,status):
        self.name = name
        self.value = value
        self.status = status

    def getName(self):
        return self.name

    
