import requests
import json
import datetime
import re

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
            if not re.match("^.*\\sx[1-3]$", line):
                return None
            temp = ""
            for x in line.split()[:-1]:
                temp += x + " "
            count = int(line.split()[-1][1:])
            deckList.update({temp[:-1] : count})
    return deckList

# parsing DuelingBook decklists
def parseDeckListDB(deckFile):
    deckList = {}
    f = open(deckFile, "r")
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


def validate(deckType, deckListString="", deckFile=None):
    # build dictionaries of the necessary data
    invalidResponses = []

    deckList = {}
    if deckType == "edopro":
        deckList = parseDeckListEDO(deckListString)
        if deckList == None:
            return ["Invalid text input."]
    elif deckType == "duelingbook":
        deckList = parseDeckListDB(deckFile)
    setList = {x["set_name"] : x["tcg_date"] for x in json.loads(requests.get(baseUrl + "/cardsets.php").text) if "tcg_date" in x}  
    banList = parseBanList()

    # check if any cards were not released before the finalDate
    for c in deckList:
        try: 
            jsonData = json.loads(requests.get(baseUrl + "/cardinfo.php?name=" + c).text)["data"][0]
            hasBeforeBanList = False
            for s in jsonData["card_sets"]:
                curDate = datetime.datetime.strptime(setList[s["set_name"]], "%Y-%m-%d")
                if(curDate < finalDate):
                    hasBeforeBanList = True
                    break
            if not hasBeforeBanList:
                invalidResponses.append(c + " is too new.")
        except:
            invalidResponses.append("API error for " + c + ". Manually see if this meets the requirements.")

    # check if any cards are not valid per the banlist
    total = 0
    for c in deckList:
        total += deckList[c]
        if deckList[c] > 3:
            invalidResponses.append(c + " is at 3 copies. You have " + str(deckList[c]) + " copies.")
        elif c in banList and deckList[c] > banList[c]:
            invalidResponses.append(c + " is " + amount[banList[c]] + ". You have " + str(deckList[c]) + " copies.")


    return invalidResponses