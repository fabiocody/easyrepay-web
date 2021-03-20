class PersonDto:
    def __init__(self, id, name, count, total):
        self.id = id
        self.name = name
        self.count = count
        self.total = total


class AddPersonDto:
    def __init__(self, name):
        self.name = name
