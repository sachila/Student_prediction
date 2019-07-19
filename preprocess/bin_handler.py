# main libraries
import pandas as pd

# import local files
from models.data_frame_model import DataFrameModel


class DataBinning:

    def __init__(self):
        self.df = DataFrameModel.data_frame
    # marks range is 0-20. so divide it up to 5 buckets
    bins = [0, 5, 10, 15, 20]

    # group the values according to the bins and added to a new column
    def group_values_by_bins(self, column_name, new_column_name):
        self.df[new_column_name] = pd.cut(self.df[column_name], self.bins)