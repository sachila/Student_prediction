
# local imports
from preprocess.null_handler import NullHandler
from preprocess.binning_handler import DataBinning
from globals.data_frame_model import DataFrameModel
from globals.column_list import ColumnList


class PreProcess:

    def __init__(self):
        self.null_handler_obj = NullHandler()
        self.data_binning_obj = DataBinning()
        self.df = DataFrameModel.data_frame

    def start_pre_process(self):
        # first we need to handle the null values
        self.null_handler_obj.handle_null()
        print(self.df.head())
        # set up the binned for term tests and final marks
        self.data_binning_obj.group_values_by_bins(ColumnList.term1ColumnName,
                                                   "binned_" + str(ColumnList.term1ColumnName))
        self.data_binning_obj.group_values_by_bins(ColumnList.term2ColumnName,
                                                   "binned_" + str(ColumnList.term2ColumnName))
        self.data_binning_obj.group_values_by_bins(ColumnList.finalColumnName,
                                                   "binned_" + str(ColumnList.finalColumnName))
        print(self.df.head())
