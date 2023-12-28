from app import useDB, log
import string
from flask import session


class test_project_manage:
    def add_project(self, name, domain, description):
        if session.get('user', None):
            creator = session.get('user')[0].get('username')
        else:
            creator = 'backendCreator'
        sql = string.Template(
            'insert into project (project_name, project_domain, project_description, project_creator) values ("$name","$domain","$description","$creator");')
        sql = sql.substitute(name=name, domain=domain, description=description, creator=creator)
        useDB.useDB().insert(sql)

    def search_project(self, name):
        """
        查询项目信息
        param: name: str 填写时，查询指定名称项目名，当为''时，查询全部项目
        return: 返回 [()] 类型
        """
        if name == '':
            sql = 'SELECT id, project_name, project_domain, project_description, project_creator FROM project;'
        else:
            sql = string.Template(
                'SELECT id, project_name, project_domain, project_description, project_creator FROM project WHERE project_name="$project_name";')
            sql = sql.substitute(project_name=name)
        return useDB.useDB().search(sql)
