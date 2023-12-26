from flask import Blueprint, render_template, jsonify, request, redirect
from app import log
from app.view import viewutil, user
from app.db import *

mod = Blueprint('module', __name__,
                template_folder='templates/util/system')


@mod.route('/maintain_module')
@user.authorize
def test_suite():
    return render_template("util/system/module_management.html")
