from bs4 import BeautifulSoup
import requests

with open("cafes.txt", "w") as f:
    pass

for n in range(7):
    html = requests.get(f"https://visit.gent.be/nl/eten-drinken/restaurants-cafes?f%5B0%5D=category%3A22&f%5B1%5D=category%3A22&page={n}").text
    data = BeautifulSoup(html, 'lxml')
    del html

    jobs = data.find_all('div', class_="views-row")
    for job in jobs:

        # print(job.find("span").text)
        cafe = job.find("h3").find("span")
        if cafe:
            name = cafe.text.replace("­", "-")
            print(name)
            with open("cafes.txt", "a", encoding="UTF-8") as f:
                f.write(name + "\n")
