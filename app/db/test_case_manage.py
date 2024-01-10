from app import useDB, log
import string


class test_case_manage:
    def __init__(self):
        self.status = 0
        self.name = ''

    def new_test_case(self, project, module, name, steps, description, isPublic):
        steps = str(steps).replace('\\', '\\\\')
        sql = f'INSERT INTO test_case ( `name`, steps, description, `status`, isPublicFunction, module_id, project_id )SELECT "{name}", "{steps}", "{description}", 1, {isPublic}, m.id module_id, p.id project_id FROM module m INNER JOIN project p ON m.project_id = p.id WHERE m.module_name = "{module}" ;'
        return useDB.useDB().insert(sql)

    def copy_test_case(self, id):
        # module, name, steps, description, isPublic
        result = self.show_test_cases(['id'], [id], [], 1)
        if len(result):
            result = result[0]
            sql = string.Template(
                'INSERT INTO test_case (project_id,module_id,name,steps,description,isPublicFunction) SELECT p.id, m.id, "${name}", "${steps}", "${description}", ${isPublic} FROM module m  JOIN project p ON m.project_id = p.id WHERE p.project_name = "${project}" AND m.module_name = "${module}" ;')
            sql = sql.substitute(name=result['name'], module=result['module'],
                                 steps=result['steps'].replace('\\', '\\\\'), description=result['description'],
                                 isPublic=result['isPublic'], project=result['project'])
            useDB.useDB().insert(sql)
            result = 1
        else:
            result = 0
        return result

    def update_test_case(self, id, fieldlist, valueList):
        import re
        update_value = '%s = "%s"' % (fieldlist[0], valueList[0])
        for i in range(1, len(fieldlist)):
            if fieldlist[i] == 'steps':
                valueList[i] = valueList[i].replace('\\', '\\\\')
            update_value += ', %s = "%s"' % (fieldlist[i], valueList[i])
        match = re.search(r'project\s*=\s*"([^"]+)", module\s*=\s*"([^"]+)"', update_value)
        if match:  # 编辑测试用例操作
            strings_to_remove = [f'project = "{match.group(1)}", ', f'module = "{match.group(2)}", ']
            result_string = update_value
            for string_to_remove in strings_to_remove:
                result_string = result_string.replace(string_to_remove, '')
            result_string = result_string.replace('name', 't.name')
            result_string = result_string.replace('steps', 't.steps')
            result_string = result_string.replace('description', 't.description')
            result_string = result_string.replace('isPublicFunction', 't.isPublicFunction')
        else:  # 删除测试用例操作
            result_string = update_value
        sql = string.Template(
            'UPDATE test_case t JOIN module m ON t.module_id = m.id JOIN project p ON t.project_id = p.id SET t.module_id = m.id, t.project_id = p.id, $field  WHERE t.id = "$id";')
        sql = sql.substitute(field=result_string, id=id)
        useDB.useDB().insert(sql)

    def search_test_case(self, idList, fieldlist):
        id_value = str(idList[0])
        for i in range(1, len(idList)):
            id_value += ',' + str(idList[i])
        search_value = fieldlist[0]
        for i in range(1, len(fieldlist)):
            search_value = search_value + ',' + fieldlist[i]
        sql = 'select ' + search_value + ' from test_case where id in ( ' + str(id_value) + ') order by id desc;'
        resultlist = useDB.useDB().search(sql)
        return resultlist

    def show_test_public_cases(self):
        results = []
        sql = 'select name from test_case where status = 1 and isPublicFunction = 1 ;'
        cases = useDB.useDB().search(sql)
        print(cases)
        log.log().logger.info('cases : %s' % cases)
        for i in range(len(cases)):
            results.append(cases[i][0])
        return results

    def show_test_cases(self, conditionList, valueList, fieldlist, rows):
        """
        show test cases
        :param conditionList: where 子句中的列明
        :param valueList: where 子句中的值
        :param fieldlist: 需要显示的列明
        """
        if len(fieldlist) == 0:  # 首次进入测试用例页面 or 编辑测试用例页面
            fieldlist = ['id', 'project', 'module', 'name', 'steps', 'description', 'isPublicFunction']
        # search_value 是select 查询语句后要显示的列明
        search_value = ''
        for i in range(0, len(fieldlist)):
            if fieldlist[i] == 'id':
                search_value = search_value + 't.id, '
            elif fieldlist[i] == 'project':
                search_value = search_value + 'p.project_name project, '
            elif fieldlist[i] == 'module':
                search_value = search_value + 'm.module_name module, '
            elif fieldlist[i] == 'name':
                search_value = search_value + '`name`'
            else:
                search_value = search_value + ',' + fieldlist[i]
        # where 子句中查询条件
        condition = ''
        for i in range(len(conditionList)):
            if i == 0:
                if conditionList[i] == 'module':  # 是否会执行,先注释
                    # log.log().logger.info(valueList[i])
                    # moduleList = ''
                    # for j in range(len(valueList[i])):
                    #     if j:
                    #         moduleList += ','
                    #     moduleList += '"' + valueList[i][j] + '"'
                    # condition += str(conditionList[i]) + ' in (' + str(moduleList) + ')'
                    pass
                else:
                    if conditionList[i] == 'id':  # id前需加表别名t
                        condition += str('t.' + conditionList[i]) + ' like "%' + str(valueList[i]) + '%"'
                    else:
                        condition += str(conditionList[i]) + ' like "%' + str(valueList[i]) + '%"'
            else:
                if conditionList[i] == 'module':
                    moduleList = ''
                    for j in range(len(valueList[i])):
                        if j:
                            moduleList += ','
                        moduleList += '"' + valueList[i][j] + '"'
                    condition += ' and ' + 'm.module_name' + ' in (' + str(moduleList) + ')'
                elif conditionList[i] == 'project':
                    projectList = ''
                    for j in range(len(valueList[i])):
                        if j:
                            projectList += ','
                        projectList += '"' + valueList[i][j] + '"'
                    condition += ' and ' + 'p.project_name' + ' in (' + str(projectList) + ')'
                else:
                    condition += ' and ' + str(conditionList[i]) + ' like "%' + str(valueList[i]) + '%"'
        # 返回的列表 [{}] 类型
        results = []

        sql = f'SELECT {search_value} FROM test_case t LEFT JOIN module m ON t.module_id = m.id LEFT JOIN project p ON t.project_id = p.id WHERE {str(condition)} and status = 1  ORDER BY id desc LIMIT {str(rows)};'
        cases = useDB.useDB().search(sql)
        log.log().logger.info('cases : %s' % cases)
        for i in range(len(cases)):
            result = {}
            result['id'] = cases[i][0]
            result['project'] = cases[i][1]
            result['module'] = cases[i][2]
            result['name'] = cases[i][3]
            result['steps'] = cases[i][4]
            result['description'] = cases[i][5]
            result['isPublic'] = cases[i][6]
            results.append(result)
        return results

    def show_test_cases_unattach(self, test_suite_id, conditionList, valueList, fieldlist, rows):
        fieldlist = ['id', 'module', 'name', 'steps', 'description', 'isPublicFunction']
        search_value = fieldlist[0]
        for i in range(1, len(fieldlist)):
            search_value = search_value + ',' + fieldlist[i]
        results = []
        log.log().logger.info('%s, %s, %s, %s, %s' % (test_suite_id, conditionList, valueList, fieldlist, rows))
        condition = ''
        for i in range(len(conditionList)):
            if i == 0:
                if conditionList[i] == 'module':
                    log.log().logger.info(valueList[i])
                    moduleList = ''
                    for j in range(len(valueList[i])):
                        if j:
                            moduleList += ','
                        moduleList += '"' + valueList[i][j] + '"'
                    condition += str(conditionList[i]) + ' in (' + str(moduleList) + ')'
                else:
                    condition += str(conditionList[i]) + ' like "%' + str(valueList[i]) + '%"'
            else:
                if conditionList[i] == 'module':
                    log.log().logger.info(valueList[i])
                    moduleList = ''
                    for j in range(len(valueList[i])):
                        if j:
                            moduleList += ','
                        moduleList += '"' + valueList[i][j] + '"'
                    condition += ' and ' + str(conditionList[i]) + ' in (' + str(moduleList) + ')'
                else:
                    condition += ' and ' + str(conditionList[i]) + ' like "%' + str(valueList[i]) + '%"'
        if condition != '':
            condition += ' and '
        sql = 'select ' + search_value + ' from test_case where status = 1 and isPublicFunction=0 and ' + str(
            condition) + ' id not in (select distinct test_case_id from test_batch where test_suite_id = ' + test_suite_id + ' )  order by module desc;'
        cases = useDB.useDB().search(sql)
        log.log().logger.info('cases : %s' % cases)
        for i in range(len(cases)):
            result = {}
            result['id'] = cases[i][0]
            result['module'] = cases[i][1]
            result['name'] = cases[i][2]
            result['steps'] = cases[i][3]
            result['description'] = cases[i][4]
            result['isPublic'] = cases[i][5]
            results.append(result)
        return results

    #
    # def show_test_keywords(self,conditionList, valueList, fieldlist,rows):
    #     results = []
    #     sql = 'select id, keyword, paraCount, template, example,description from test_keyword where keyword like "%' + str(valueList[0]) + '%" order by id desc limit '+ str(rows)+';'
    #     cases = useDB.useDB().search(sql)
    #     log.log().logger.info('cases : %s'%cases)
    #     for i in range(len(cases)):
    #         result = {}
    #         result['id'] = cases[i][0]
    #         result['keyword'] = cases[i][1]
    #         result['paraCount'] = cases[i][2]
    #         result['template'] = cases[i][3]
    #         result['example'] = cases[i][4]
    #         result['description'] = cases[i][5]
    #         results.append(result)
    #     return results
