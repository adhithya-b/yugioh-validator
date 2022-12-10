from flask import Flask, render_template, request
import json
from validator import validate
app = Flask(__name__)

@app.route("/home")
def index():
    return render_template('home.html')

@app.route("/validate", methods=['POST'])
def checkDeck():
    resp = validate(request.form['decklist'])
    print(resp)
    if resp:
        return render_template('home.html', responses=resp)
    else:
        return render_template('home.html', valid="True")

if __name__ == '__main__':
    app.run(debug=True)