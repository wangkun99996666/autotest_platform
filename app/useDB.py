# -*- coding: utf-8 -*-
from app import config
from app import logsql as log


class sqliteDB(object):

    def __init__(self):
        return

    def connect(self):
        import sqlite3, os, platform
        path = os.getcwd()
        if platform.system() == 'Windows':
            path += '\\'
        else:
            path += '/'

        # change root password to yours:
        conn = sqlite3.connect(path + config.sqliteFile)
        return conn

    def search(self, sql):
        log.log().logger.info(sql)
        conn = self.connect()
        cursor = conn.cursor()
        try:
            cursor.execute(sql)
            values = cursor.fetchall()
            cursor.close()
            conn.close()
        except:
            log.log().logger.error('search error')
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
        return values

    def insert(self, sql):
        conn = self.connect()
        cursor = conn.cursor()
        try:
            cursor.execute(sql)
            log.log().logger.info(sql)
            cursor.close()
            conn.commit()
        except:
            log.log().logger.info('commit error')
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
        conn.close()


class mysqlDB(object):

    def __init__(self):
        return

    def connect(self):
        # change root password to yours:
        import mysql.connector
        conn = mysql.connector.connect(host=config.db_host, port=config.db_port, user=config.db_user,
                                       password=config.db_password, database=config.database,
                                       auth_plugin='mysql_native_password', charset='utf8')
        return conn

    def search(self, sql):
        """
        返回指定sql的全部查询结果
        """
        conn = self.connect()
        cursor = conn.cursor()
        try:
            cursor.execute(sql)
            values = cursor.fetchall()
            cursor.close()
            conn.close()
        except:
            log.log().logger.error('search error--->' + str(sql))
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
        return values

    def insert(self, sql):
        """
        增、删、改操作
        """
        log.log().logger.debug(sql)
        conn = self.connect()
        cursor = conn.cursor()
        try:
            cursor.execute(sql)
            cursor.close()
            conn.commit()
        except Exception as e:
            log.log().logger.error('commit error--->' + str(sql))
            log.log().logger.error(str(e))
            return False
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
        return True

    def excutesql(self, sql):
        log.log().logger.debug(sql)
        conn = self.connect()
        cursor = conn.cursor()
        try:
            cursor.execute(sql)
            cursor.close()
            conn.commit()
        except:
            log.log().logger.error('commit error--->' + str(sql))
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    # 测试查询，防止sql注入
    def searchsql(self, sql, args):
        conn = self.connect()
        cursor = conn.cursor()
        try:
            cursor.execute(sql, args)
            values = cursor.fetchall()
            cursor.close()
        except:
            log.log().logger.error('select error--->' + str(sql))
        finally:
            if cursor:
                cursor.close()
        return values


class useDB(object):

    def __init__(self):
        self.DBtype = config.DBtype
        return

    def insert(self, sql):
        if self.DBtype == '1':
            return sqliteDB().insert(sql)
        else:
            return mysqlDB().insert(sql)

    def search(self, sql):
        if self.DBtype == '1':
            return sqliteDB().search(sql)
        else:
            return mysqlDB().search(sql)

    def searchsql(self, sql, args):
        if self.DBtype == '1':
            return sqliteDB().search(sql)
        else:
            return mysqlDB().searchsql(sql, args)
