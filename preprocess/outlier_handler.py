# main libraries
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from scipy import stats
import numpy as np

# local imports
from globals.data_frame_model import DataFrameModel
from globals.column_list import ColumnList


class OutlierHandler:

    def __init__(self):
        self.df = DataFrameModel.data_frame
        self.rows_to_remove = []
        self.q1_percentiles = 0.25
        self.q3_percentiles = 0.75

    # we need to remove term marks which are not consistent with final marks
    # term1 term2 final
    # 4     5     17
    # 16    15    4
    def remove_outliers_in_mark_columns(self):
        self.rows_to_remove = []
        # iterating the rows
        for index, row in self.df.iterrows():

            cell_term1 = self.df.at[index,  ColumnList.term1ColumnName]
            cell_term2 = self.df.at[index,  ColumnList.term2ColumnName]
            cell_final = self.df.at[index,  ColumnList.finalColumnName]
            term_mean = (cell_term1 + cell_term2) / 2

            '''
            if term_mean <= 5 and cell_final >= 15: 
                self.rows_to_remove.append(index)

            if term_mean >= 15 and cell_final <= 5: 
                self.rows_to_remove.append(index)
            '''

            term1_diff = abs(cell_term1-cell_final)
            term2_diff = abs(cell_term2-cell_final)

            if term1_diff >= 5 or term2_diff >= 5:
                self.rows_to_remove.append(index)

            if cell_term1 <= 3 or cell_term2 <= 3 or cell_final <= 3:
                self.rows_to_remove.append(index)

            # remove the rows with highest score. these are noisy records
            if term_mean == 20 or cell_final == 20:
                self.rows_to_remove.append(index)

        # remove the duplicate indexes
        self.rows_to_remove = list(dict.fromkeys(self.rows_to_remove))
        # remove from dataframe
        self.df.drop(self.rows_to_remove, inplace=True)

    # in order to smooth the data we need to remove the absence > 16
    def remove_outliers_in_absence_col(self):
        self.rows_to_remove = []
        # iterating the rows
        for index, row in self.df.iterrows():
            cell = self.df.at[index,  ColumnList.absencesColumnName]
            if cell > 16:
                self.rows_to_remove.append(index)

        # remove the duplicate indexes
        self.rows_to_remove = list(dict.fromkeys(self.rows_to_remove))
        # remove from dataframe
        self.df.drop(self.rows_to_remove, inplace=True)

    # age should not exceed 20
    def remove_outliers_in_age_col(self):
        self.rows_to_remove = []
        # iterating the rows
        for index, row in self.df.iterrows():
            cell = self.df.at[index,  ColumnList.ageColumnName]
            if cell > 20 or cell < 16:
                self.rows_to_remove.append(index)

        # remove the duplicate indexes
        self.rows_to_remove = list(dict.fromkeys(self.rows_to_remove))
        # remove from dataframe
        self.df.drop(self.rows_to_remove, inplace=True)

    def remove_col(self, column):
        del self.df[column]

    # z score value for columns should be between -3 to 3.
    # Any other values apart from this range is an outlier
    def z_score(self, column):
        z = np.abs(stats.zscore(self.df[column]))
        threshold = 3
        print("Z score above 3 for column " + column + " = " + str(np.where(z > threshold)))
        print("Z score below 3 for column " + column + " = " + str(np.where(z < -threshold)))
        print("\n")

    def scatter_plot(self, column_x, column_y):
        fig, ax = plt.subplots()
        ax.scatter(self.df[column_x], self.df[column_y])
        ax.set_xlabel(column_x)
        ax.set_ylabel(column_y)
        plt.show()

    def box_plot(self):
        sns.boxplot(x="variable", y="value", data=pd.melt(self.df))
        plt.show()

    # find the interquartile range for entire data frame
    def find_quantile(self):
        q1 = self.df.quantile(self.q1_percentiles)
        q3 = self.df.quantile(self.q3_percentiles)
        iqr = q3 - q1
        print("======== IQR =================== \n")
        print(iqr)

    def handle_iqr_outliers(self):
        q1 = self.df.quantile(self.q1_percentiles)
        q3 = self.df.quantile(self.q3_percentiles)
        iqr = q3 - q1
        self.df = self.df[~((self.df < (q1 - 1.5 * iqr)) | (self.df > (q3 + 1.5 * iqr))).any(axis=1)]





