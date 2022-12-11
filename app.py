from flask import Flask, render_template, request
from validator import validate
import os
app = Flask(__name__)
@app.route("/home", methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        resp = []
        if request.form['deckType'] == 'edopro':
            resp = validate(request.form['deckType'], deckListString=request.form['decklist'])
        elif request.form['deckType'] == 'duelingbook':
            f = request.files['dbFile']
            if f:
                f.save(f.filename)
                resp = validate(request.form['deckType'], deckFile=f.filename)
                os.remove(f.filename)

        if resp:
            return render_template('home.html', responses=resp)
        else:
            return render_template('home.html', valid="True")
    else:
        return render_template('home.html')

if __name__ == '__main__':
    app.run(debug=True)