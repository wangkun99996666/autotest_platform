from flask import Blueprint, render_template, jsonify, request, redirect
from app import log
from app.view import viewutil, user
from app.db import test_project

mod = Blueprint('project', __name__,
                template_folder='templates/util/system')


@mod.route('/maintain_project')
@user.authorize
def project():
    return render_template("util/system/project_management.html")


@mod.route('/add_new_project', methods=['POST', 'GET'])
@user.authorize
def save_new_project():
    log.log().logger.info(request)
    if request.method == 'GET':
        # log.log().logger.info('Get')
        return render_template("util/system/add_project.html")
    if request.method == 'POST':
        info = request.json
        log.log().logger.info('info : %s' % info)
        project_name = viewutil.getInfoAttribute(info, 'projectName')
        project_domain = viewutil.getInfoAttribute(info, 'projectDomain')
        project_description = viewutil.getInfoAttribute(info, 'projectDescription')
        if project_name == '' or project_domain == '':
            return jsonify({"code": 201, "message": "必填字段不能为空"})
        else:
            test_project.test_project_manage().add_project(project_name, project_domain, project_description)
        return jsonify({"code": 200, "message": "请求成功"})


@mod.route('/search_project', methods=['POST'])
@user.authorize
def search_project():
    info = request.json
    log.log().logger.info('info : %s' % info)
    limit = viewutil.getInfoAttribute(info, 'limit')
    name = viewutil.getInfoAttribute(info, 'name')
    offset = viewutil.getInfoAttribute(info, 'offset')
    offset = (offset - 1) * limit
    project = viewutil.getInfoAttribute(info, 'project')
    type = viewutil.getInfoAttribute(info, 'type')
    if name == 'All':
        name = ''
    results = test_project.test_project_manage().search_project(name)
    dict_resilts = [{'id': mid, 'name': name, 'domain': domain, 'description': description, 'creator': creator} for
                    mid, name, domain, description, creator in results]
    lenth = len(dict_resilts)
    results = {"total": lenth, "rows": dict_resilts}
    return results


@mod.route('/search_project_name', methods=['POST'])
@user.authorize
def search_project_name():
    info = request.json
    log.log().logger.info('info : %s' % info)
    projectName = viewutil.getInfoAttribute(info, 'projectName')
    if projectName == 'All':
        projectName = ''
    results = test_project.test_project_manage().search_project(projectName)
    searchName = [m[1] for m in results]
    searchName = str(set(searchName))[2:-2].replace("'", "")
    return jsonify({"projectName": searchName})


@mod.route('/save_edit_project', methods=['POST'])
@user.authorize
def save_edit_project():
    info = request.json
    project_name = info.get("projectName", "")
    project_domain = info.get("projectDomain", "")
    project_desc = info.get("projectDescription", "")
    rid = info.get("id", "")
    result = test_project.test_project_manage().edit_project(project_name, project_domain, project_desc, rid)
    return jsonify({"code": 200, "message": "请求成功"})


@mod.route('/edit_project', methods=['POST'])
@user.authorize
def edit_project():
    info = request.json
    projectId = info.get("projectId", "")
    result = test_project.test_project_manage().search_project(name='', rid=projectId)
    result_list = [{"id": m[0], "name": m[1], "domain": m[2], "description": m[3], "creator": m[4]} for m in result]
    return jsonify({"code": 200, "message": result_list})

@mod.route('/open_edit_project', methods=['GET'])
@user.authorize
def open_edit_project():
    return render_template("util/system/edit_project.html")

@mod.route('/copy_project', methods=['POST'])
@user.authorize
def copy_project():
    info = request.json
    rid = info.get("projectId", "")
    result = test_project.test_project_manage().copy_project(rid)
    return jsonify({"code": 200, "message": "请求成功"})

@mod.route('/delete_project', methods=['POST'])
@user.authorize
def delete_project():
    info = request.json
    rid = info.get("projectId", "")
    result = test_project.test_project_manage().delete_project(rid)
    return jsonify({"code": 200, "message": "请求成功"})