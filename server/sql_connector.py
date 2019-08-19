import mysql.connector
#
# def db_conn():
#   global mysql_conn
#   mysql_conn = mysql.connector.connect(host='localhost',
#                                    database='student_performance',
#                                    user='root',
#                                    password='')

class SqlConnector:

    def get_query(self, query):
        conn = mysql.connector.connect(host='localhost',
                                       database='student_performance',
                                       user='root',
                                       password='')

        cursor = conn.cursor(buffered=True)
        cursor.execute(query)

        columns = cursor.description
        data = []
        result = {}

        rows= cursor.fetchall()
        row_len = len(rows)
        if row_len <= 0:
            result['status'] = False;
            result['message'] = ' No result set to fetch from.'
            conn.close()
            return result

        for value in rows:
            tmp = {}
            for (index, column) in enumerate(value):
                tmp[columns[index][0]] = column
            data.append(tmp)
        # print(data)

        conn.commit()
        try:
            result['status'] = True;
            result['message'] = data

        except Exception as e:
            result['status'] = False;
            result['message'] = [e]

        conn.close()
        return result

    # def get_query1(self, query):
    #
    #     with(multiprocessing.Pool(4, initializer=db_conn)) as Pool:
    #         for res in Pool.map(self.get, query):
    #             print(res)
    #             return res
    #         Pool.close()
    #         Pool.join()

    def set_query(self, query):
        conn = mysql.connector.connect(host='localhost',
                                       database='student_performance',
                                       user='root',
                                       password='')
        cursor = conn.cursor()
        result = {}

        try:
            cursor.execute(query)
            conn.commit()
            result['status'] = True;
            result['message'] = {"studentId": cursor.lastrowid}
        except Exception as e:

            result['status'] = False;
            result['message'] = "failure - " + str(e)

        conn.close()
        return result

