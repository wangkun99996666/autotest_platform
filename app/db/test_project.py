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
        if name == '':
            sql = 'SELECT id, project_name, project_domain, project_description, project_creator FROM project;'
        else:
            sql = string.Template(
                'SELECT id, project_name, project_domain, project_description, project_creator FROM project WHERE project_name="$project_name";')
            sql = sql.substitute(project_name=name)
        return useDB.useDB().search(sql)
