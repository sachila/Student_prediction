# main libraries
import pandas as pd

# import local files
from globals.column_list import ColumnList
from globals.data_frame_model import DataFrameModel


class NullHandler:

    def __init__(self):
        self.df = DataFrameModel.data_frame

    def handle_null(self):
        # check for null values
        print("null values")
        print(self.df.isnull().sum())
        # remove the null value rows from dataframe
        rows_to_remove = []

        # iterating the rows
        for index, row in self.df.iterrows():
            # iterating the columns
            for col in self.df.columns:
                # push all the nan values in term1 and absance columns to rows_to_remove array
                cell_value = self.df.loc[self.df.index[index], col]
                if pd.isnull(cell_value):
                    rows_to_remove.append(index)

        # remove the duplicate indexes
        rows_to_remove = list(dict.fromkeys(rows_to_remove))
        # remove from dataframe
        self.df.drop(rows_to_remove, inplace=True)
        print("new row count = " + str(self.df.shape))

        # change the text columns to numeric
        print(self.df.iterrows())

        self.two_way_text_to_number(ColumnList.extraActivitiesColumnName, "yes")
        self.two_way_text_to_number(ColumnList.internetColumnName, "yes")
        self.two_way_text_to_number(ColumnList.sexColumnName, "M")

    # convert the Binary text options to numeric values
    # eg. yes -> 1 , no-> 0
    def two_way_text_to_number(self, current_col_name, main_option):
        # iterating the rows
        for index, row in self.df.iterrows():
            if self.df.at[index, current_col_name] == main_option:
                self.df.at[index, current_col_name] = 1
            else:
                self.df.at[index, current_col_name] = 0
