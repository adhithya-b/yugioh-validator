import requests
import json
import datetime

baseUrl = "https://db.ygoprodeck.com/api/v7"
finalDate = datetime.datetime(2014, 1, 1)
amount = ["banned", "limited", "semi-limited"]

# parsing EDOPro decklists
def parseDeckListEDO(deckListString):
    categories = {"Main Deck:", "Extra Deck:", "Side Deck:"}
    deckList = {}
    deckListString = deckListString.split("\n")
    for line in deckListString:
        line = line.strip()
        if line != "\n" and line != "" and line not in categories:
            temp = ""
            for x in line.split()[:-1]:
                temp += x + " "
            count = int(line.split()[-1][-1])
            deckList.update({temp[:-1] : count})
    return deckList

# parsing DuelingBook decklists
def parseDeckListDB():
    deckList = {}
    f = open("db.txt", "r")
    for line in f:
        line = line.strip()
        if line[0] != "#" and line[0] != "!":
            cardData = json.loads(requests.get(baseUrl + "/cardinfo.php?id=" + line).text)["data"][0]
            cardName = cardData["name"]
            if cardName not in deckList:
                deckList.update({cardName : 1})
            else:
                deckList.update({cardName : deckList[cardName] + 1})
    return deckList

# parse the banlist file
def parseBanList():
    banList = {}
    f = open("banlist.txt", "r")
    for line in f:
        line = line.strip()
        vals = line.split("=")
        banList.update({vals[0] : int(vals[1])})
    return banList


def validate(deckListString):
    # build dictionaries of the necessary data
    invalidResponses = []
    deckList = parseDeckListEDO(deckListString)
    setList = {x["set_name"] : x["tcg_date"] for x in json.loads(requests.get(baseUrl + "/cardsets.php").text) if "tcg_date" in x}  
    banList = parseBanList()

    # check if any cards were not released before the finalDate
    for c in deckList:
        jsonData = json.loads(requests.get(baseUrl + "/cardinfo.php?name=" + c).text)["data"][0]
        hasBeforeBanList = False
        for s in jsonData["card_sets"]:
            curDate = datetime.datetime.strptime(setList[s["set_name"]], "%Y-%m-%d")
            if(curDate < finalDate):
                hasBeforeBanList = True
                break
        if not hasBeforeBanList:
            invalidResponses.append(c + " is too new.")

    # check if any cards are not valid per the banlist
    for c in deckList:
        if deckList[c] > 3:
            invalidResponses.append(c + " is at 3 copies. You have " + str(deckList[c]) + " copies.")
        elif c in banList and deckList[c] > banList[c]:
            invalidResponses.append(c + " is " + amount[banList[c]] + ". You have " + str(deckList[c]) + " copies.")
    
    return invalidResponses