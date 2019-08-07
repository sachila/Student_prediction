from flask import Flask
from flask_cors import CORS
from flask import request

import json
from server.sql_connector import SqlConnector
from neural_network.saved_model import SavedModel

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


@app.route('/predict', methods=['POST'])
def predict_marks():

    req = request.json
    student_data = sql.get_query("SELECT * FROM students WHERE id= '" + str(req)+"' ")

    result = {}

    if student_data['message'] == None or student_data['message'][0] == None:
        result['status'] = False;
        result['message'] = "error while fetching student data"
        json.dumps(result)

    st_data = student_data['message'][0]
    st_data['term1'] = int(st_data['term1']) / 5
    st_data['term2'] = int(st_data['term2']) / 5
    print(st_data['term1'])
    print(st_data['term2'])

    save_model = SavedModel()
    data = save_model.normalize_data(student_data['message'][0])

    predictions =  save_model.load_model(data).tolist()

    print(predictions[0][0])
    if  predictions[0][0] == None:
        result['status'] = False;
        result['message'] = "error while fetching parsing predicted data"
        json.dumps(result)

    final_marks = predictions[0][0] * 5

    if final_marks > 90 or final_marks < 10:
        final_marks = st_data['term1'] * 5

    result['status'] = True
    result['message'] = final_marks
    return json.dumps(result)


@app.route('/studentById', methods=['POST'])
def get_student_by_id():
    req = request.json
    result = sql.get_query("SELECT * FROM students WHERE id= '" + str(req)+"' ")
    return json.dumps(result)


@app.route('/saveStudent', methods=['POST'])
def save_student():
    json_data  = request.json
    # print(json_data['name'])
    try:
        sql_query = "insert into students (name, gender, age, failures, extraActivities, workTime, internet, " \
                    "freetime, absence, term1, term2 ) values ('"+ str(json_data['name'])+"','"+str(json_data['gender'])+"','"+str(json_data['age'])+"','"+str(json_data['failures'])+"','"+str(json_data['extraActivities'])+"','"+str(json_data['workTime'])+"','"+str(json_data['internet'])+"','"+str(json_data['freetime'])+"','"+str(json_data['absence'])+"','"+str(json_data['term1'])+"','"+str(json_data['term2'])+"' )"

        # print(sql_query)
        result = sql.set_query(sql_query)
        print(result)
        return json.dumps(result)
    except Exception as e:
        return json.dumps(e)


if __name__ == '__main__':
    app.run(debug=True, port=5500)


