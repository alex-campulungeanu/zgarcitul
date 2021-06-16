from flask import Blueprint

from app.utils.response import response_success
# from ..shared.Authentification import Auth

main = Blueprint('main', __name__)

@main.route('/testmain', methods = ['GET'])
# @Auth.auth_required
def testmain():
    return response_success('App is working')

# @main.route('/movies', methods = ['GET'])
# def movies():
#     movies = [
#         { 
#             "name": "The Shawshank Redemption",
#             "casts": ["Tim Robbins", "Morgan Freeman", "Bob Gunton", "William Sadler"],
#             "genres": ["Drama"]
#         },
#         {
#         "name": "The Godfather ",
#         "casts": ["Marlon Brando", "Al Pacino", "James Caan", "Diane Keaton"],
#         "genres": ["Crime", "Drama"]
#         }
#     ]
#     return jsonify(movies)