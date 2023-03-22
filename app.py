from boggle import Boggle
from flask import Flask, redirect, render_template, session, request, flash, url_for, json, jsonify 
from flask_debugtoolbar import DebugToolbarExtension
import requests


app=Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
boggle_game = Boggle()
toolbar = DebugToolbarExtension(app)
app.debug = True


@app.route('/')
def make_board():
    board = boggle_game.make_board()
    session['board'] = board
    return render_template('board.html', board=board)


@app.route("/check-guess", methods=["POST"])
def check_guess():
    guess = request.get_json()["guess"]
  
    # Check if word is valid on board
    if not boggle_game.check_valid_word(guess):
        return jsonify(result="not-a-word")
  
    if not boggle_game.check_word_on_board(guess):
        return jsonify(result="not-on-board")
  
    return jsonify(result="ok")

@app.route('/make-guess', methods=['POST'])
def make_guess():
    guess = request.form['guess']
    response = requests.post('http://127.0.0.1:5000/check-guess', json={'guess': guess}, headers={'Content-Type': 'application/json'})
    result = response.json()['result']
    return redirect(url_for('check_guess'), jsonify(result=result))
    

@app.route('/restart')
def restart():
    render_template('restart.html') 

