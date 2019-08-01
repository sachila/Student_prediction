# main libraries
import numpy as np
import tensorflow as tf
import keras
from sklearn.metrics import mean_squared_error
from keras.callbacks import TensorBoard
from keras.callbacks import Callback, ModelCheckpoint
from time import time
from keras import metrics

# import local files
from globals.data_frame_model import DataFrameModel


class NeuralNetwork:

    def __init__(self):
        self.df = DataFrameModel.data_frame
        self.model = None

        self.training_features = ['sex', 'age', 'extraActivities',  'internet',  'freetime',  'absences', 'Term1',
                                  'Term2']
        self.label_feature = ['Final']
        self.percentage_of_training = 80

        self.m = self.df.shape[0]
        self.n = len(self.training_features)

        self.number_example_in_training = int((self.percentage_of_training * self.m) / 100)
        self.number_example_in_test = int(self.m - self.number_example_in_training)

        self.training_data_features = self.df.head(self.number_example_in_training)[self.training_features]
        # # It’s a good practice to shuffle the data before splitting between a train and test set.
        # self.training_data_features = self.training_data_features\
        #      .reindex(np.random.permutation(self.training_data_features.index))

        self.training_data_labels = self.df.head(self.number_example_in_training)[self.label_feature]

        self.test_data_features = self.df.head(self.number_example_in_test)[self.training_features]
        self.test_data_labels = self.df.head(self.number_example_in_test)[self.label_feature]

        self.EPOCHS = 1000

        # tensorboard set up
        self.tensorboard = TensorBoard(log_dir='logs'.format(time()))

        print("====================training data set ================")
        print(self.training_data_features.shape)

    def build_model(self):
        self.model = keras.models.Sequential([
            keras.layers.Dense(19, activation=tf.nn.relu, kernel_regularizer=keras.regularizers.l2(0.01),
                               input_shape=(self.training_data_features.shape[1],)),
            keras.layers.Dense(13, activation=tf.nn.relu, kernel_regularizer=keras.regularizers.l2(0.01)),
            keras.layers.Dense(7, activation=tf.nn.relu, kernel_regularizer=keras.regularizers.l2(0.01)),
            keras.layers.Dense(1)
        ])

        optimizer = tf.train.RMSPropOptimizer(learning_rate=0.006)
        print(self.model.summary())

        self.model.compile(loss='mse',  optimizer=optimizer, metrics=[metrics.mae])

    def fit_model(self):
        filepath = "best_weights/best_weights.{epoch:02d}-{val_loss:.2f}.h5"
        checkpoint = ModelCheckpoint(filepath, monitor='val_loss', verbose=1, save_best_only=True,
                                     save_weights_only=True, mode='max')

        callback_list = [PrintDot(), self.tensorboard, checkpoint]
        return self.model.fit(self.training_data_features, self.training_data_labels, epochs=self.EPOCHS,
                              callbacks=callback_list, shuffle=True, validation_split=0.01, batch_size=32)

    def evaluate_model(self):
        train_acc, test_acc = self.model.evaluate(self.test_data_features, self.test_data_labels, verbose=0)
        print('Test accuracy = ' + str(test_acc) + '\n')

    def mean_squared_error(self):
        predicted_value = self.model.predict(self.test_data_features)
        mse = mean_squared_error(np.asmatrix(self.test_data_labels), predicted_value)
        print("Mean Square Error ", mse)
        for i in range(0, 10):
            print(predicted_value[i], "--", np.asmatrix(self.test_data_labels)[i])

    def model_save(self):
        self.model.save('train_models/model_simple.h5')


class PrintDot(Callback):

  def on_epoch_end(self, epoch, logs):
    if epoch % 100 == 0: print('')
    print('.', end='')