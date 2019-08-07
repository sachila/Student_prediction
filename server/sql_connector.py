import mysql.connector


class SqlConnector:

    def __init__(self):
        self.conn = mysql.connector.connect(host='localhost',
                                   database='student_performance',
                                   user='root',
                                   password='')

    def get_query(self, query):

        cursor = self.conn.cursor(buffered=True)
        cursor.execute(query)

        columns = cursor.description
        data = []
        for value in cursor.fetchall():
            tmp = {}
            for (index, column) in enumerate(value):
                tmp[columns[index][0]] = column
            data.append(tmp)
        # print(data)

        self.conn.commit()
        result = {}
        try:
            result['status'] = True;
            result['message'] = data

        except Exception as e:
            result['status'] = False;
            result['message'] = [e]

        return result

    def set_query(self, query):

        cursor = self.conn.cursor()
        result = {}

        try:
            cursor.execute(query)
            self.conn.commit()
            result['status'] = True;
            result['message'] = "success"
        except Exception as e:

            result['status'] = False;
            result['message'] = "failure - " + str(e)

        return result

