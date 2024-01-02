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

    def search_project(self, name, rid=None):
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
        if rid:
            sql = string.Template(
                'SELECT id, project_name, project_domain, project_description, project_creator FROM project WHERE id="$rid";')
            sql = sql.substitute(rid=rid)
        return useDB.useDB().search(sql)

    def edit_project(self, name, domain, desc, rid):
        """
        编辑项目信息
        param: name: str 待更新的项目名称
        param: domain: str 待更新的项目域名
        param: desc: str 待更新的项目描述
        return : 返回[()] 类型
        """
        if len(name) == 0 and len(domain) == 0 and len(desc) == 0:
            return [()]
        elif len(name) > 0 and len(domain) == 0 and len(desc) == 0:
            sql = string.Template('UPDATE project SET project_name="$name" WHERE  id="$rid";')
            sql = sql.substitute(name=name, rid=rid)
            return useDB.useDB().insert(sql)
        elif len(name) == 0 and len(domain) > 0 and len(desc) == 0:
            sql = string.Template('UPDATE project SET project_domain="$domain" WHERE  id="$rid";')
            sql = sql.substitute(domain=domain, rid=rid)
            return useDB.useDB().insert(sql)
        elif len(name) == 0 and len(domain) == 0 and len(desc) > 0:
            sql = string.Template('UPDATE project SET project_description="$description" WHERE  id="$rid";')
            sql = sql.substitute(description=desc, rid=rid)
            return useDB.useDB().insert(sql)
        elif len(name) > 0 and len(domain) > 0 and len(desc) == 0:
            sql = string.Template('UPDATE project SET project_name="$name", project_domain="$domain" WHERE  id="$rid";')
            sql = sql.substitute(name=name, domain=domain, rid=rid)
            return useDB.useDB().insert(sql)
        elif len(name) > 0 and len(domain) == 0 and len(desc) > 0:
            sql = string.Template('UPDATE project SET project_description="$description", project_name="$name" WHERE  id="$rid";')
            sql = sql.substitute(description=desc, name=name, rid=rid)
            return useDB.useDB().insert(sql)
        elif len(name) == 0 and len(domain) > 0 and len(desc) > 0:
            sql = string.Template('UPDATE project SET project_description="$description", project_domain="$domain" WHERE  id="$rid";')
            sql = sql.substitute(description=desc, domain=domain, rid=rid)
            return useDB.useDB().insert(sql)
        elif len(name) > 0 and len(domain) > 0 and len(desc) > 0:
            sql = string.Template('UPDATE project SET project_description="$description", project_name="$name", project_domain="$domain" WHERE  id="$rid";')
            sql = sql.substitute(description=desc, name=name, domain=domain, rid=rid)
            return useDB.useDB().insert(sql)
        else:
            return [()]

    def copy_project(self, rid):
        """
        parameter: rid: string
        return: 返回[()]
        """
        sql = string.Template('SELECT project_name, project_domain, project_description FROM project WHERE id="$rid";')
        sql = sql.substitute(rid=rid)
        result = useDB.useDB().search(sql)
        name = result[0][0]
        domain = result[0][1]
        desc = result[0][2]
        sql = string.Template(
            'INSERT INTO project (project_name, project_domain, project_description, project_creator) VALUES ("$name","$domain","$desc","$creator");')
        sql = sql.substitute(name=name, domain=domain, desc=desc, creator=session.get('user')[0].get('username'))
        return useDB.useDB().insert(sql)

    def delete_project(self, rid):
        """
        parameter: rid: string
        return: 返回[()]
        """
        sql = string.Template('DELETE FROM project WHERE id="$rid";')
        sql = sql.substitute(rid=rid)
        return useDB.useDB().insert(sql)