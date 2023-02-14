from flask import Flask, render_template, request, jsonify, send_from_directory
from validator import validate
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='build', template_folder='build', static_url_path='/')
CORS(app)

@app.route("/test", methods=['GET', 'POST'])
def test():
    return {'message': 'test'}

@app.route("/")
def index():
    print("displaying index.html")
    # return send_from_directory(app.static_folder, 'index.html')
    return app.send_static_file('index.html')

@app.route("/validateDeck", methods=['POST'])
def validateDeck():
    print("validating deck")
    resp = []
    data = request.get_json()
    if data['deckType'] == 'edopro':
        resp = validate(data['deckType'], deckListString=data['decklist'])
    elif data['deckType'] == 'duelingbook':
        f = request.files['dbFile']
        if f:
            f.save(f.filename)
            resp = validate(data['deckType'], deckFile=f.filename)
            os.remove(f.filename)
    else:
        return ["Input is faulty."]

    print(resp)
    if resp:
        return resp
    else:
        return ["Your deck is valid."]

if __name__ == '__main__':
    app.run(debug=True)