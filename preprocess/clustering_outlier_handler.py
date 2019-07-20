# main libraries
import matplotlib.pyplot as plt
import numpy as np
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler
from sklearn import metrics
# local imports
from globals.data_frame_model import DataFrameModel


class ClusteringOutlierHandler:

    def __init__(self):
        self.df = DataFrameModel.data_frame

    # a density-based based clustering technique
    def dbscan_plot(self, column_x, column_y):
        x = self.df[[column_x, column_y]]
        x = x.values.astype("float32", copy=False)

        x = StandardScaler().fit_transform(x)
        # min_samples : The minimum number of data points you want in a neighborhood to define a cluster.
        # eps : The radius of our neighborhoods around a data point p
        dbsc = DBSCAN(eps=0.5, min_samples=5).fit(x)
        y_pred = dbsc.fit_predict(x)

        labels = dbsc.labels_

        n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)
        n_noise_ = list(labels).count(-1)

        print('Estimated number of clusters: %d' % n_clusters_)
        print('Estimated number of noise points: %d' % n_noise_)
        print("Silhouette Coefficient: %0.3f" % metrics.silhouette_score(x, labels))

        # Let's plot the data now
        plt.scatter(x[:, 0], x[:, 1], c=y_pred)
        plt.title('Estimated number of clusters: %d' % n_clusters_)
        plt.show()
