# globals
import pandas as pd
from keras.models import load_model
from keras import backend


# locals
from globals.column_list import ColumnList


class SavedModel:

    def normalize_data(self, data):
        self.two_way_text_to_number(data, ColumnList.extraActivitiesColumnName, "yes")
        self.two_way_text_to_number(data, ColumnList.internetColumnName, "yes")
        self.two_way_text_to_number(data, ColumnList.sexColumnName, "M")
        self.remove_columns(data, ColumnList.studentNameColumnName)
        self.remove_columns(data, ColumnList.failuresColumnName)
        self.remove_columns(data, ColumnList.idColumnName)

        return data

    def load_model(self, data):
        data = pd.DataFrame([data])
        backend.clear_session()

        trained_model = load_model('train_models/model_simple.h5')
        pred_test = trained_model.predict(data)
        y_classes = pred_test.argmax(axis=-1)
        print("=========Classes========")
        print(pred_test)
        return pred_test

    def two_way_text_to_number(self,data, current_col_name, main_option):
        # print(data)
        if data[current_col_name] == main_option:
            data[current_col_name] = 1

        else:
            data[current_col_name] = 0


    def remove_columns(self, data, column_name):
        del data[column_name]