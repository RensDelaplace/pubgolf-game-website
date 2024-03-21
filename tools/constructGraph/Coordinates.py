class Coordinates:
    def __init__(self, lat, lon):
        self.lat = lat
        self.lon = lon

    def __repr__(self):
        return f"[{self.lat}, {self.lon}]"   #lat en lon switchen voor api
