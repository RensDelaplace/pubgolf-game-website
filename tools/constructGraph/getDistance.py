import requests as r
import json
from Coordinates import Coordinates as coord
import itertools
import numpy as np


def getDistance(coord1, coord2, KEY):
    TYPE = "PEDESTRIAN"
    link = "https://www.mapquestapi.com/directions/v2/optimizedroute?key=" + KEY + "&json={%22locations%22:[{%22latLng%22:{%22lat%22:%22" + str(coord1.lat) + "%22,%22lng%22:%22" + str(coord1.lon) + "%22}},{%22latLng%22:{%22lat%22:%22" + str(coord2.lat) + "%22,%22lng%22:%22" + str(coord2.lon) + "%22}}],%22options%22:{%22routeType%22:%22" + TYPE + "%22,%22unit%22:%22k%22}}"
    return r.get(link).json()["route"]["distance"]


def constructTriangleGraph(coordsPath, graphPath, amount):
    with open(coordsPath) as f:
        coordinates = [coord(*tuple(map(float, line.split(";")[:2]))) for line in f][0:amount]

    data = np.zeros((amount, amount), dtype="double")
    itt_count = 0
    total_itts = amount * (amount - 1)/2
    for i, a in enumerate(coordinates):
        for j, b in enumerate(coordinates[i+1:]):
            itt_count += 1
            print(100 * itt_count/total_itts, "%", sep="")
            if itt_count < 13000:
                data[i][j + i + 1] = getDistance(a, b, "YXPoNs9TTILgG57TxICtZ4upQKTOotG4")
            else:
                data[i][j + i + 1] = getDistance(a, b, "IgXprome85Pf9rWajL2RuvHaqvIv6Wx2")

    data += data.T

    with open(graphPath, "w") as f:
        for line in data:
            for item in line[:-1]:
                f.write(f"{item};")
            f.write(f"{line[-1]}\n")


constructTriangleGraph("src/data/circle_coords_w_name.csv", "src/data/cafe_graph.csv", 159)
