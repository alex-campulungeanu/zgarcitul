import os
import sys
import logging
from logging.handlers import RotatingFileHandler
from termcolor import colored

from flask_sqlalchemy import get_debug_queries


class BaseConfig(object):
    ## key config
    APP_NAME = os.getenv('APP_NAME')
    SECRET_KEY = os.getenv('SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_EXPIRATION_SECONDS = os.getenv('JWT_EXPIRATION_SECONDS')
    JWT_TOKEN_NAME = os.getenv('JWT_TOKEN_NAME')
    SECRET_WORD_REGISTRATION = os.getenv('SECRET_WORD_REGISTRATION')
    JWT_CHECK_DB = True
    SLEEP_BETWEEN_CALLS = os.getenv('SLEEP_BETWEEN_CALLS', 5)
    
    # proxy
    HTTP_PROXY = os.getenv('HTTP_PROXY')
    HTTPS_PROXY = os.getenv('HTTPS_PROXY')
    
    ## log config
    DEBUG = False
    SHOW_CUSTOM_LOG = os.getenv('SHOW_CUSTOM_LOG', False)
    LOG_TO_FILE = os.getenv('LOG_TO_FILE', False)
    DEBUG_SQL = os.getenv('DEBUG_SQL', False)
    # LOGGING_FORMAT = "%(asctime)s - %(levelname)s - %(filename)s - LINE: %(lineno)d  - MSG: %(message)s"
    LOGGING_FORMAT = "%(asctime)s - %(levelname)s - " + colored("%(filename)s", 'green') + " - " + colored('LINE: ', 'green') +  "%(lineno)d  - " + colored("%(message)s", 'red')
    # logging.basicConfig(format='%(asctime)s,%(msecs)d %(levelname)-8s [%(filename)s:%(lineno)d] %(message)s',
    # datefmt='%Y-%m-%d:%H:%
    LOG_FILE_NAME = "logs/applogs.log"
    LOGGING_LEVEL = logging.DEBUG
    
    ## database configuration
    DB_NAME = os.getenv('DB_NAME')
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_HOST = os.getenv('DB_HOST')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False #show query to console
    
    # mail configuration
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
    MAIL_USERNAME = os.getenv('EMAIL_USER')
    MAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')
    MAIL_SENDER = os.getenv('MAIL_SENDER') 

    def __init__(self):
        self.SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(user=self.DB_USER,pw=self.DB_PASSWORD,url=self.DB_HOST,db=self.DB_NAME)
            
class Development(BaseConfig): 
    """ Development environment configuration """
    DEBUG = True
    JWT_SECRET_KEY = 'jwtdefaultsecretkeyforallmachines'

class DevelopmentDocker(BaseConfig):
    """ Development environment configuration """
    DEBUG = True

class Production(BaseConfig):
    """ Production environment configurations """
    DEBUG = False
    

class Testing(BaseConfig):
    """ Development environment configuration """
    TESTING = True

app_config = {
    'development': Development(),
    # 'development.docker': DevelopmentDocker(),
    'production': Production(),
    'testing': Testing(),
    'default': Development()
}

def setup_logger(app):
    if app.config['SHOW_CUSTOM_LOG']:
        formatter = logging.Formatter(app.config["LOGGING_FORMAT"])
        ## file logging
        if app.config['LOG_TO_FILE'] is True:
            if not os.path.exists('logs'):
                os.mkdir('logs')
            file_handler = RotatingFileHandler(app.config["LOG_FILE_NAME"], maxBytes=10240, backupCount=1)
            file_handler.setFormatter(formatter)
            file_handler.setLevel(logging.DEBUG)
            app.logger.addHandler(file_handler)
        ## console logging
        from flask.logging import default_handler
        app.logger.removeHandler(default_handler) ##removing Default Handler
        stream_handler = logging.StreamHandler(sys.stdout)
        stream_handler.setLevel(logging.DEBUG)
        stream_handler.setFormatter(formatter)
        app.logger.addHandler(stream_handler)
        # loggers = [logging.getLogger()]  # get the root logger
        # loggers = loggers + [logging.getLogger(name) for name in logging.root.manager.loggerDict]

    def sql_debug(response):
        queries = list(get_debug_queries())
        query_str = ''
        total_duration = 0.0
        for q in queries:
            total_duration += q.duration
            stmt = str(q.statement % q.parameters).replace('\n', '\n       ')
            query_str += 'Query: {0}\nDuration: {1}ms\n\n'.format(stmt, round(q.duration * 1000, 2))
        print('=' * 80)
        print(' SQL Queries - {0} Queries Executed in {1}ms'.format(len(queries), round(total_duration * 1000, 2)))
        print('=' * 80)
        print(query_str.rstrip('\n'))
        print('=' * 80 + '\n')
        return response
    if app.config['DEBUG_SQL'] is True: ## don't use app.config['DEBUG_SQL'] == True or simple if app.config['DEBUG_SQL'] 
        app.after_request(sql_debug)