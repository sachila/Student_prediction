import pandas as pd
# local imports
from globals.data_frame_model import DataFrameModel
# service to import the student data from service
# keep the dataframe consistent


class StudentDataFrameService:

    def import_student_data(self):
        # Read the data in the CSV file using pandas
        # and set it to data frame model
        DataFrameModel.data_frame = pd.read_csv('data/students.csv')

