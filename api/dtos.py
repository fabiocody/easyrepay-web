class PersonDto:
    def __init__(self, name, count, total):
        self.name = name
        self.count = count
        self.total = total


class AddPersonDto:
    def __init__(self, name):
        self.name = name
