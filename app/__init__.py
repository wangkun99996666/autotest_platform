from flask import Flask
from flask_bootstrap import Bootstrap
from app.view import user, uitest, utils, apinew, minder, minderfiles, module_management as module, \
    project_management as project

app = Flask(__name__)
app.config.from_object('config')
bootstrap = Bootstrap(app)
app.register_blueprint(user.mod)
app.register_blueprint(uitest.mod)
app.register_blueprint(utils.mod)
app.register_blueprint(apinew.mod)
app.register_blueprint(minder.mod)
app.register_blueprint(minderfiles.mod)
app.register_blueprint(module.mod)
app.register_blueprint(project.mod)
from app import views
