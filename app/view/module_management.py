from flask import Blueprint, render_template, jsonify, request, redirect
from app import log
from app.view import viewutil, user
from app.db import test_module

mod = Blueprint('module', __name__,
                template_folder='templates/util/system')


@mod.route('/maintain_module')
@user.authorize
def module():
    return render_template("util/system/module_management.html")


@mod.route('/add_new_module', methods=['GET'])
@user.authorize
def add_new_module():
    return render_template("util/system/add_module.html")


@mod.route('/save_new_module', methods=['POST'])
@user.authorize
def save_new_module():
    info = request.json
    projectName = info.get("projectName", "")
    moduleName = info.get("moduleName", "")
    description = info.get("moduleDescription", "")
    if projectName == '' or moduleName == '':
        return jsonify({"code": 200, "message": "必填字段为空"})
    if projectName == 'All':
        projectName = ''
    project = test_module.test_module_manage().search_project(projectName)
    nameList = [row[1] for row in project]
    for i in nameList:
        test_module.test_module_manage().add_module(moduleName, description, i)
    return jsonify({"code": 200, "message": "ok"})
