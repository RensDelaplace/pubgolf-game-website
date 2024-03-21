import time

import requests as r
import json
from Coordinates import Coordinates as coord
import itertools
import numpy as np
import requests



def getBorders(start, length):
    h = [ ]
    print(start, length)
    for i in range(length):
        h.append(start+i)
    return h

def makeMatrix(horizontal, vertical):
    print("New matrix")
    print("   ", len(horizontal))
    print("   ", len(vertical))
    print("h->",getBorders(0,len(horizontal)))
    print("v->",getBorders(len(horizontal),len(vertical)))

    data = horizontal+vertical
    print("-->", data)

    # destionations -> horizontal    sources -> vertical
    body = {'locations':data,'destinations':getBorders(0,len(horizontal)),'metrics':['distance'],'sources':getBorders(len(horizontal), len(vertical)),'units':'m'}
    print(body)
    headers = {
        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        'Authorization': '5b3ce3597851110001cf6248fffedf8d96224f68816f255633c06001',
        'Content-Type': 'application/json; charset=utf-8'
    }
    call = requests.post('https://api.openrouteservice.org/v2/matrix/foot-walking', json=body, headers=headers)

    print(call.status_code, call.reason)
    return call.json()["distances"]



    # return np.zeros((len(vertical), len(horizontal)), dtype="double")


def constructTriangleGraph(coordsPath, graphPath):
    with open(coordsPath) as f:
        coords = [coord(*tuple(map(float, line.split(";")[:2]))) for line in f]

    coordinates = []
    for el in coords:
        coordinates.append([el.lon, el.lat])
    print(coordinates)
    horizontalWidth = 0
    verticalWidth = 0
    constWidth = 25
    M = makeMatrix((coordinates[horizontalWidth:horizontalWidth + constWidth]),(coordinates[verticalWidth:verticalWidth + constWidth]))
    horizontalWidth += constWidth
    while horizontalWidth < len(coordinates):
        N = makeMatrix((coordinates[horizontalWidth:horizontalWidth + constWidth]),(coordinates[verticalWidth:verticalWidth + constWidth]))
        try:
            M = np.concatenate([M,N] ,axis=1)
        except:
            print("N = ",N)
        horizontalWidth += constWidth
    horizontalWidth = 0
    verticalWidth += constWidth
    time.sleep(30)
    while verticalWidth < len(coordinates):
        N = makeMatrix((coordinates[horizontalWidth:horizontalWidth + constWidth]),(coordinates[verticalWidth:verticalWidth + constWidth]))
        horizontalWidth += constWidth
        while horizontalWidth < len(coordinates):
            K = makeMatrix((coordinates[horizontalWidth:horizontalWidth + constWidth]),(coordinates[verticalWidth:verticalWidth + constWidth]))
            N = np.concatenate([N, K], axis=1)
            horizontalWidth += constWidth
        M = np.concatenate([M,N] ,axis=0)
        horizontalWidth = 0
        verticalWidth += constWidth
        time.sleep(30)

    with open(graphPath, "w") as f:
        for row in M:
            for co in row[:-1]:
                f.write(f"{co};")
            f.write(f"{row[-1]}\n")

constructTriangleGraph("data.csv", "matrix_afstanden_3.csv")
