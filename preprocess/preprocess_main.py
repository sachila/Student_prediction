
# local imports
from preprocess.null_handler import NullHandler
from preprocess.binning_handler import DataBinning
from globals.data_frame_model import DataFrameModel
from globals.column_list import ColumnList
from preprocess.outlier_handler import OutlierHandler
from preprocess.clustering_outlier_handler import ClusteringOutlierHandler


class PreProcess:

    def __init__(self):
        self.null_handler_obj = NullHandler()
        self.data_binning_obj = DataBinning()
        self.outlier_handler_obj = OutlierHandler()
        self.clustering_outlier_handler_obj = ClusteringOutlierHandler()
        # data frame
        self.df = DataFrameModel.data_frame

    def start_pre_process(self):
        # check for existing null values
        print("===================== BEFORE NULL COLUMN LIST ==============  \n")
        print(self.df.isnull().sum())
        print("\n")

        # Handle the null values
        self.null_handler_obj.handle_null()

        print("===================== AFTER NULL COLUMN LIST ==============  \n")
        print(self.df.isnull().sum())
        print("\n")

        print("======================= BEFORE DATA PRE PROCESS ==============================  \n")
        # HANDLE OUTLIERS

        # Box plot
        # self.outlier_handler_obj.box_plot()

        # # Scatter plot
        # self.outlier_handler_obj.scatter_plot(ColumnList.absencesColumnName, ColumnList.finalColumnName)

        # # DBSCAN
        # self.clustering_outlier_handler_obj.dbscan_plot(ColumnList.absencesColumnName, ColumnList.finalColumnName)

        # z score
        self.outlier_handler_obj.z_score(ColumnList.ageColumnName)
        self.outlier_handler_obj.z_score(ColumnList.absencesColumnName)

        # IQR
        self.outlier_handler_obj.find_quantile()

        # handle outliers in columns
        self.outlier_handler_obj.remove_outliers_in_mark_columns()
        self.outlier_handler_obj.remove_outliers_in_absence_col()
        self.outlier_handler_obj.remove_outliers_in_age_col()
        self.outlier_handler_obj.remove_col(ColumnList.failuresColumnName)
        self.outlier_handler_obj.handle_iqr_outliers()

        print("======================= AFTER DATA PRE PROCESS ==============================  \n")

        # # Box plot s
        # self.outlier_handler_obj.box_plot()

        # # Scatter plot
        # self.outlier_handler_obj.scatter_plot(ColumnList.absencesColumnName, ColumnList.finalColumnName)

        # # DBSCAN
        # self.clustering_outlier_handler_obj.dbscan_plot(ColumnList.absencesColumnName, ColumnList.finalColumnName)

        # z score
        self.outlier_handler_obj.z_score(ColumnList.ageColumnName)
        self.outlier_handler_obj.z_score(ColumnList.absencesColumnName)

        # IQR
        self.outlier_handler_obj.find_quantile()

        # set up the binning for term tests and final marks
        self.data_binning_obj.group_values_by_bins(ColumnList.term1ColumnName,
                                                   "binned_" + str(ColumnList.term1ColumnName))
        self.data_binning_obj.group_values_by_bins(ColumnList.term2ColumnName,
                                                   "binned_" + str(ColumnList.term2ColumnName))
        self.data_binning_obj.group_values_by_bins(ColumnList.finalColumnName,
                                                   "binned_" + str(ColumnList.finalColumnName))

        print("new row after data processing = " + str(self.df.shape))
        print("\n")
        print(self.df.head())
