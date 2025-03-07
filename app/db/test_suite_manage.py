from app import useDB, log
import string


class test_suite_manage:
    def __init__(self):
        self.status = 0
        self.name = ''

    def new_test_suite(self, project, module, name, run_type, description, batchId):
        sql = string.Template(
            'INSERT INTO test_suite (project_id,module_id,`name`,run_type,description,batchId) SELECT p.id, m.id, "${name}", "${run_type}", "${description}", "${batchId}" FROM module m INNER JOIN project p ON m.project_id=p.id WHERE p.project_name="${project}" AND m.module_name="${module}";')
        sql = sql.substitute(project=project, module=module, name=name, run_type=run_type, description=description,
                             batchId=batchId)
        useDB.useDB().insert(sql)

    def update_test_suite(self, id, fieldlist, valueList):
        update_value = '%s = "%s"' % (fieldlist[0], valueList[0])
        for i in range(1, len(fieldlist)):
            update_value += ', %s = "%s"' % (fieldlist[i], valueList[i])
        sql = string.Template('update test_suite set $field where id = "$id";')
        sql = sql.substitute(field=update_value, id=id)
        useDB.useDB().insert(sql)

    def search_test_suite(self, id, field):
        sql = string.Template('select $field from test_suite where id = $id;')
        sql = sql.substitute(field=field, id=id)
        result = useDB.useDB().search(sql)
        log.log().logger.info(result)
        if len(result):
            if field == 'run_type':
                if result[0][0] == '0':
                    result = 'Android'
                elif result[0][0] == '1':
                    result = 'iOS'
                elif result[0][0] == '2':
                    result = 'Chrome'
                else:
                    result = result[0][0]
        else:
            result = []
        return result

    def search_test_suite_list(self):
        sql = 'select * from test_suite limit 10;'
        result = useDB.useDB().search(sql)[0]
        log.log().logger.info(result)
        return result

    def show_test_suites(self, conditionList, valueList, fieldlist, rows):
        fieldlist = []
        if len(fieldlist) == 0:
            fieldlist = ['id', 'project', 'module', 'name', 'status', 'run_type', 'description', 'batchId']
        search_value = 't.' + fieldlist[0]
        log.log().logger.info(fieldlist)
        for i in range(1, len(fieldlist)):
            if fieldlist[i] == 'project':
                search_value = search_value + ',p.' + fieldlist[i] + '_name'
            elif fieldlist[i] == 'module':
                search_value = search_value + ',m.' + fieldlist[i] + '_name'
            else:
                search_value = search_value + ',t.' + fieldlist[i]
        condition = 'isDeleted = 0 '
        for i in range(len(conditionList)):
            if len(str(valueList[i])):
                if conditionList[i] == 'run_type':
                    if valueList[i] == 'Chrome':
                        valueList[i] = 2
                    elif valueList[i] == 'Android':
                        valueList[i] = 0
                    elif valueList[i] == 'iOS':
                        valueList[i] = 1
                if conditionList[i] in ('id', 'status', 'run_type'):
                    condition += ' AND t.' + str(conditionList[i]) + ' = "' + str(valueList[i]) + '"'
                else:
                    if conditionList[i] == 'project':
                        conditionList[i] = 'p.project_name'
                    elif conditionList[i] == 'module':
                        conditionList[i] = 'm.module_name'
                    condition += ' AND ' + str(conditionList[i]) + ' LIKE "%' + str(valueList[i]) + '%"'
        results = []
        sql = 'SELECT ' + str(
            search_value) + ' FROM test_suite t INNER JOIN module m ON t.module_id=m.id INNER JOIN project p ON t.project_id=p.id WHERE ' + str(
            condition) + ' ORDER BY t.id desc LIMIT ' + str(rows) + ';'
        cases = useDB.useDB().search(sql)
        log.log().logger.info('cases : %s ' % cases)
        for i in range(len(cases)):
            result = {}
            result['id'] = cases[i][0]
            result['project'] = cases[i][1]
            result['module'] = cases[i][2]
            result['name'] = cases[i][3]
            if cases[i][4] == 0:
                status = '0-准备执行'
            elif cases[i][4] == 1:
                status = '1-执行完成'
            elif cases[i][4] == 2:
                status = '2-执行中'
            elif cases[i][4] == -1:
                status = '未执行'
            else:
                status = 'unknown'
            result['status'] = status
            if cases[i][5] == '0':
                run_type = 'Android'
            elif cases[i][5] == '1':
                run_type = 'iOS'
            elif cases[i][5] == '2':
                run_type = 'Chrome'
            else:
                run_type = cases[i][5]
            result['run_type'] = run_type
            result['description'] = cases[i][6]
            result['batchId'] = cases[i][7]
            results.append(result)
        # log.log().logger.info(results)
        return results

    def new_test_run_list(self, Id):
        sql = 'update test_suite set status = 0,runCount=1 where id = %s;' % str(Id)
        useDB.useDB().insert(sql)

    def test_suite_list(self, type):
        sql = 'select id from test_suite where status = 0;'
        idList = useDB.useDB().search(sql)
        return idList

    def copy_test_suite(self, id, batchId):
        # module, name, steps, description, isPublic
        result = self.show_test_suites(['id'], [id], [], 1)
        if len(result):
            result = result[0]
            run_type = ''
            if result["run_type"] == 'Chrome':
                run_type = 2
            elif result["run_type"] == 'Android':
                run_type = 0
            elif result["run_type"] == 'iOS':
                run_type = 1
            self.new_test_suite(result['project'], result['module'], result["name"], str(run_type),
                                result["description"], batchId)
            result = 1
        else:
            result = 0
        return result
