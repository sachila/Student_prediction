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
    sql = SqlConnector()
    result = sql.get_query('SELECT * FROM students')
    return json.dumps(result)


# @app.route('/deleteAllStudents', methods=['GET'])
def delete_all():
    sql = SqlConnector()
    result = sql.set_query('DELETE FROM students')
    return json.dumps(result)


@app.route('/studentsByLimit', methods=['POST'])
def get_students_by_limit():
    print(request.json)
    result = sql.get_query('SELECT * FROM students limit 100')
    return json.dumps(result)


@app.route('/students', methods=['GET'])
def get_all_students():
    result = sql.get_query('SELECT * FROM students')
    return json.dumps(result)


@app.route('/getAverageFreetimeSummary', methods=['GET'])
def get_average_freetime_summary():
    result = sql.get_query("SELECT SUM(freetime) as sum, AVG(freetime) as avg FROM students")
    return json.dumps(result)


@app.route('/getAverageWorktimeSummary', methods=['GET'])
def get_average_worktime_summary():
    result = sql.get_query("SELECT SUM(workTime) as sum, AVG(workTime) as avg FROM students")
    return json.dumps(result)


@app.route('/getAverageInternetSummary', methods=['GET'])
def get_average_internet_summary():
    result = sql.get_query("SELECT SUM(internet) as sum, AVG(internet) as avg FROM students")
    return json.dumps(result)


@app.route('/getAgeFreetimeSummary', methods=['GET'])
def get_age_freetime_summary():
    result = sql.get_query("SELECT SUM(freetime) as freetime, age FROM students GROUP BY age")
    return json.dumps(result)


@app.route('/getAgeWorktimeSummary', methods=['GET'])
def get_age_work_summary():
    result = sql.get_query("SELECT SUM(workTime) as workTime, age FROM students GROUP BY age")
    return json.dumps(result)


@app.route('/getAgeInternetSummary', methods=['GET'])
def get_age_internet_summary():
    result = sql.get_query("SELECT SUM(internet) as internet, age FROM students GROUP BY age")
    return json.dumps(result)


@app.route('/getExtraActivitySummary', methods=['GET'])
def get_extra_activity_summary():
    f_count = sql.get_query("SELECT COUNT(*) as extraYes FROM students WHERE extraActivities= 'yes'")
    m_count = sql.get_query("SELECT COUNT(*) as extraNo FROM students WHERE extraActivities= 'no'")
    print(f_count)
    result = {}

    result['status'] = True
    result['message'] = {}
    result['message']['extraYes'] = f_count['message'][0]['extraYes']
    result['message']['extraNo'] = m_count['message'][0]['extraNo']

    return json.dumps(result)

@app.route('/getGenderSummary', methods=['GET'])
def get_gender_summary():
    f_count = sql.get_query("SELECT COUNT(*) as fCount FROM students WHERE gender= 'F'")
    m_count = sql.get_query("SELECT COUNT(*) as mCount FROM students WHERE gender= 'M'")
    print(f_count)
    result = {}

    result['status'] = True
    result['message'] = {}
    result['message']['femaleCount'] = f_count['message'][0]['fCount']
    result['message']['maleCount'] = m_count['message'][0]['mCount']

    return json.dumps(result)


@app.route('/getTermsAverage', methods=['GET'])
def get_terms_average():

    t1_avg = sql.get_query("SELECT AVG(term1) as t1Avg FROM students")
    t2_avg = sql.get_query("SELECT AVG(term2) as t2Avg FROM students ")

    print(t1_avg)
    result = {}

    result['status'] = True
    result['message'] = {}
    result['message']['t1Avg'] = t1_avg['message'][0]['t1Avg']
    result['message']['t2Avg'] = t2_avg['message'][0]['t2Avg']

    return json.dumps(result)


@app.route('/getAgeSummary', methods=['GET'])
def get_age_summary():

    rows = sql.get_query("SELECT COUNT(age) as ageCount, age FROM students GROUP BY age")
    return json.dumps(rows)


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


