import os
import sys
from colorama import init
from termcolor import colored
import logging

init()

##The enviroments needs to be loaded first !!!
from pathlib import Path
from dotenv import load_dotenv
env_name = os.getenv('FLASK_ENV', 'development')
if env_name == 'production':
    env_path = Path('.') / '.env.production'
elif env_name == 'development':
    env_path = Path('.') / '.env.development'
else:
    sys.exit(colored('FLASK_ENV accepted values are: production / development', 'red'))

load_dotenv(dotenv_path=env_path, verbose=True)

from flask import Flask, send_from_directory
from flask_cors import CORS
# from flask_restful import Api
from flask_jwt_extended import JWTManager

from app.config import app_config, setup_logger
from flask_mail import Mail
from flask_migrate import Migrate

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
# app = Flask(__name__)

CORS(app) ## enable CORS on all routes
app.config.from_object(app_config[env_name])

# init extensions
mail = Mail()
migrate = Migrate()
jwt = JWTManager(app)

from app.models import db, ma
db.init_app(app)
ma.init_app(app)
mail.init_app(app)
migrate.init_app(app, db)

# init logging
setup_logger(app)

# init routes not used
# from app.resources.routes import create_routes
# api = Api(app=app)
# create_routes(api=api)

@app.route("/", defaults={'path':''})
@app.route("/app/<path:path>")
def serve(path):
    return send_from_directory(app.static_folder, 'index.html')

from app.controlller import register_controller
register_controller(app)

from app.commands import register_commands
register_commands(app)

# register handlers
from app.handler import (jwt_handler, http_handler)
jwt_handler(jwt)
http_handler(app)

app.logger.info(f"\n \
######################################################### \n \
#   ENV:        {env_name}                                \n \
#   DB_HOST:    {app.config['DB_HOST']}                   \n \
#   ENV:        {env_name}                                \n \
######################################################### ")


@app.route('/test')
def test():
    resp_test = {
            "name": "alex",
            "age": "12"
        }
    return resp_test, 200
    # return 'This is a test !'

if env_name == 'production':
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)