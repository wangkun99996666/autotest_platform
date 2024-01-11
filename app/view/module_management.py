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
    projectName = info.get("projectName", "")
    module_name = info.get("module_name", "")
    if projectName is None:
        projectName = ""
    if module_name is None:
        module_name = ""
    resuletset = test_module.test_module_manage().search_module(projectName, module_name)
    resultList = [{"name": res[1]} for res in resuletset]
    return jsonify({"code": 200, "message": resultList})

@mod.post('/delete_module')
@user.authorize
def delete_module():
    """
    删除模块
    """
    info = request.json
    module_id = info.get("moduleId", "")
    result = test_module.test_module_manage().delete_module(module_id)
    return jsonify({"code": 200, "message": result})

@mod.post("/copy_module")
@user.authorize
def copy_module():
    """
    复制模块
    """
    info = request.json
    module_id = info.get("moduleId", "")
    result = test_module.test_module_manage().copy_module(module_id)
    return jsonify({"code": 200, "message": result})


@mod.get("/open_edit_module")
@user.authorize
def open_edit_module():
    """
    打开编辑模块
    """
    return render_template("util/system/edit_module.html")

@mod.post("/save_edit_module")
@user.authorize
def save_edit_module():
    """
    保存编辑模块
    """
    info = request.json
    project_name = info.get("projectName", "")
    module_name = info.get("moduleName", "")
    module_description = info.get("moduleDescription", "")
    module_id = info.get("moduleId", "")
    result = test_module.test_module_manage().edit_module(module_id, project_name, module_name, module_description)
    return jsonify({"code": 200, "message": result})

@mod.post("/show_module")
@user.authorize
def show_module():
    """
    显示模块
    """
    info = request.json
    module_id = info.get("moduleId", "")
    result = test_module.test_module_manage().get_module_info(module_id)
    result_list = [{"module_name": m[0], "module_description": m[1]} for m in result]
    return jsonify({"code": 200, "message": result_list})