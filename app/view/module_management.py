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


@mod.post('/search_module')
@user.authorize
def search_module():
    info = request.json
    limit = info.get("limit", 10)
    offset = info.get("offset", 0)
    project = info.get("project", "All")
    module = info.get("module", "All")
    ttype = info.get("type", "")
    if project == 'All' and module == 'All':  # 点击模块页面进入逻辑
        project = ''
        module = ''
        resultSet = test_module.test_module_manage().search_module()
    elif project != 'All' and module == 'All':
        module = ''
        resultSet = test_module.test_module_manage().search_module(project)
    elif module != 'All' and project == 'All':
        project = ''
        resultSet = test_module.test_module_manage().search_module(module_name=module)
    elif project != 'All' and module != 'All':
        resultSet = test_module.test_module_manage().search_module(project_name=project, module_name=module)
    else:
        return jsonify({"code": 201, "message": "异常情况"})
    resultList = [
        {"id": res[0], "name": res[1], "description": res[2], "creator": res[3],
         "time": res[4], "projectName": res[5]}
        for res in resultSet]
    length = len(resultList)
    return jsonify({"total": length, "rows": resultList})


@mod.post('/search_module_name')
@user.authorize
def searchModuleName():
    """
    首次进入模块页面使用
    """
    info = request.json
    projectName = info.get("projectName", "All")
    module_name = info.get("module_name", "All")
    resuletset = test_module.test_module_manage().search_module()
    resultList = [{"name": res[1]} for res in resuletset]
    return jsonify({"code": 200, "message": resultList})
