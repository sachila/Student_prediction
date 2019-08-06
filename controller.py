from flask import Flask
from flask_cors import CORS
from flask import request

import json
from server.sql_connector import SqlConnector

app = Flask(__name__)
CORS(app)
CORS(app, resources=r'/*', allow_headers='Content-Type')

sql = SqlConnector()


@app.route('/', methods=['GET'])
def testapi():
    result = sql.get_query('SELECT * FROM students')
    return json.dumps(result)


@app.route('/students', methods=['GET'])
def get_all_students():
    result = sql.get_query('SELECT * FROM students')
    return json.dumps(result)


@app.route('/studentById', methods=['POST'])
def get_student_by_id():
    req = request.json;
    result = sql.get_query("SELECT * FROM students WHERE id= '"+ str(req)+"' ")
    return json.dumps(result)


@app.route('/saveStudent', methods=['POST'])
def save_student():
    json_data  = request.json
    print(json_data['name'])
    try:
        sql_query = "insert into students (name, gender, age, failures, extracurricular, internet, freetime, absence" \
                    ", term1, term2 ) values ('"+ str(json_data['name'])+"','"+str(json_data['gender'])+"','"+str(json_data['age'])+"','"+str(json_data['failures'])+"','"+str(json_data['extracurricular'])+"','"+str(json_data['internet'])+"','"+str(json_data['freetime'])+"','"+str(json_data['absence'])+"','"+str(json_data['term1'])+"','"+str(json_data['term2'])+"' )"

        print(sql_query)
        result = sql.set_query(sql_query)
        print(result)
        return json.dumps(result)
    except Exception as e:
        return json.dumps(e)


if __name__ == '__main__':
    app.run(debug=True, port=5500)


