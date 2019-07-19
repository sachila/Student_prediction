# main libraries
import pandas as pd
import numpy as np
import math

# import local files
from prediction_globals import PredictionGlobals as pg


def handleNull():
    # check for null values
    print("null values")
    print(pg.df.isnull().sum())
    # remove the null value rows from dataframe
    rowsToRemove = []

    # iterating the rows
    for index, row in pg.df.iterrows():
        # iterating the columns
        for col in pg.df.columns:
            # push all the nan values in term1 and absance columns to rowsToRemove array
            cellValue = pg.df.loc[pg.df.index[index], col]
            if pd.isnull(cellValue):
                rowsToRemove.append(index)

    # remove the duplicate indexes
    rowsToRemove = list(dict.fromkeys(rowsToRemove))
    # remove from dataframe
    pg.df.drop(rowsToRemove, inplace=True)
    print("new row count = " + str(pg.df.shape))

    # change the text columns to numeric
    print(pg.df.iterrows())

    twoWayTextToNumber("extraActivities", "yes")
    twoWayTextToNumber("internet", "yes")
    twoWayTextToNumber("sex", "M")

    print(pg.df.head())


# convert the Binary text options to numeric values
# eg. yes -> 1 , no-> 0
def twoWayTextToNumber(currentColName, mainOption):
    # iterating the rows
    for index, row in pg.df.iterrows():
        if pg.df.at[index, currentColName] == mainOption:
            pg.df.at[index, currentColName] = 1
        else:
            pg.df.at[index, currentColName] = 0
