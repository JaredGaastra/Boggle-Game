from boggle import Boggle
from flask import Flask, redirect, render_template, session, request, flash, url_for, json, jsonify 
from flask_debugtoolbar import DebugToolbarExtension
import requests
import pdb
import logging


app=Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
boggle_game = Boggle()
toolbar = DebugToolbarExtension(app)
app.debug = True

    


@app.route('/')
def make_board():
    """creates board and shows board"""
    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)

    return render_template("board.html", board=board,
                           highscore=highscore,
                           nplays=nplays)


@app.route("/check-guess")
def check_guess():
    # 
    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})

    # app.logger.info(guess)
    # # pdb.set_trace()
    # # Check if word is valid on board
    # if not boggle_game.check_valid_word(guess):
    #     return jsonify(result="not-a-word")
  
    # if not boggle_game.check_word_on_board(guess):
    #     return jsonify(result="not-on-board")
  
    # return jsonify(result="ok")

@app.route("/post-score", methods=["POST"])
def post_score():
    """Receive score, update nplays, update high score if appropriate."""

    score = request.json["score"]
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)

    session['nplays'] = nplays + 1
    session['highscore'] = max(score, highscore)

    return jsonify(brokeRecord=score > highscore)
    

