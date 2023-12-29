from app import useDB, log
import string, datetime
from flask import session


class test_module_manage:
    def add_module(self, name, description, project_name):
        """
        添加模块信息
        param: name:str 模块名称
        param: description: str 模块描述
        param: project_name: str 项目名称
        """
        if session.get('user', None):
            creator = session.get('user')[0].get('username')
        else:
            creator = 'backendCreator'
        current = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        sql = f'INSERT INTO module(module_name, module_description, module_creator,creator_time,project_id) SELECT "{name}","{description}","{creator}","{current}", id FROM project WHERE project_name = "{project_name}";'
        useDB.useDB().insert(sql)

    def search_project(self, name):
        """
        module模块中当添加的项目名称为All时，需要查询项目表中有多少项目
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

    def search_module(self, project_name='', module_name=''):
        # 点击进入模块页面使用的sql
        if project_name == '' and module_name == '':
            sql = 'SELECT m.id, m.module_name, m.module_description, m.module_creator, m.creator_time, p.project_name FROM module m LEFT JOIN project p ON m.project_id = p.id;'
        elif len(project_name) > 0 and len(module_name) == 0:
            sql = f'SELECT m.id, m.module_name, m.module_description, m.module_creator, m.creator_time, p.project_name FROM module m LEFT JOIN project p ON m.project_id = p.id WHERE p.project_name = "{project_name}";'
        elif len(module_name) > 0 and len(project_name) == 0:
            sql = f'SELECT m.id, m.module_name, m.module_description, m.module_creator, m.creator_time, p.project_name FROM module m LEFT JOIN project p ON m.project_id = p.id WHERE m.module_name= "{module_name}";'
        elif len(project_name) > 0 and len(module_name) > 0:
            sql = f'SELECT m.id, m.module_name, m.module_description, m.module_creator, m.creator_time, p.project_name FROM module m LEFT JOIN project p ON m.project_id = p.id WHERE m.module_name= "{module_name}" AND p.project_name ="{project_name}";'
        return useDB.useDB().search(sql)

