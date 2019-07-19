# main libraries
import pandas as pd
from prediction_globals import PredictionGlobals as pg
from preprocess.null_handler import handleNull

# Read the data in the CSV file using pandas

pg.df = pd.read_csv('data/students.csv')
print(pg.df.shape)

# start data pre process
handleNull()

# don't close console
input("Press enter to exit ;)")
