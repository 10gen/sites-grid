
class Status:
    def __init__(self,name,ordinal):
        self.name = name
        self.ordinal = ordinal

    def cssClass(self):
        return "status_" + self.name.lower()

    def __cmp__(self,other):
        return self.ordinal - other.ordinal

    def __eq__(self,other):
        return self.ordinal == other.ordinal

    def __hash__(self):
        return self.ordinal

    def __str__(self):
        return self.name
    
Status.OK = Status( "OK" , 0 )
Status.WARNING = Status( "Warning" , 10 )
Status.ERROR = Status( "Error" , 20 )
Status.FATAL = Status( "Fatal" , 30 )

    
class Result:
    def __init__(self):
        self.fields = {}

    def add(self,field):
        self.fields[field.getName()] = field
