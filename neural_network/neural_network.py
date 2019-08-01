# main libraries
import numpy as np
import tensorflow as tf
import keras
from sklearn.metrics import mean_squared_error, accuracy_score
from keras.callbacks import TensorBoard
from keras.callbacks import Callback, ModelCheckpoint, EarlyStopping
from time import time

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
        print('number_example_in_training',  self.number_example_in_training)
        print('number_example_in_test',  self.number_example_in_test)

        self.training_data_features = self.df.head(self.number_example_in_training)[self.training_features]

        self.training_data_labels = self.df.head(self.number_example_in_training)[self.label_feature]

        self.test_data_features = self.df.head(self.number_example_in_test)[self.training_features]
        self.test_data_labels = self.df.head(self.number_example_in_test)[self.label_feature]

        self.EPOCHS = 300

        # tensorboard set up
        self.tensorboard = TensorBoard(log_dir='logs'.format(time()))

        print("====================training data set ================")
        print(self.training_data_features.shape)

    def build_model(self):
        self.model = keras.models.Sequential([
            keras.layers.Dense(128, activation='relu', input_shape=(self.training_data_features.shape[1],)),
            keras.layers.Dense(64, activation='relu'),
            keras.layers.Dense(32, activation='relu'),
            keras.layers.Dense(1)
        ])

        print(self.model.summary())

        self.model.compile(loss='mse',  optimizer='rmsprop', metrics=['accuracy'])

    def fit_model(self):
        # Save the model after every epoch.
        file_path = "best_weights/best_weights.{epoch:02d}-{acc:.2f}.h5"
        checkpoint = ModelCheckpoint(file_path, monitor='acc', verbose=1, save_best_only=True,
                                     save_weights_only=True, mode='max')
        # Stop training when a monitored quantity has stopped improving.
        early_stop = EarlyStopping(monitor='acc', patience=30, verbose=1, mode='auto')

        callback_list = [self.tensorboard, checkpoint, early_stop]
        history = self.model.fit(self.training_data_features, self.training_data_labels, epochs=self.EPOCHS,
                                 callbacks=callback_list, validation_split=0.02, shuffle=True)

        loss, metrics = self.model.evaluate(self.test_data_features, self.test_data_labels)
        print("Mean Square Error = " + str(loss) + "\n")
        print("Accuracy = " + str(metrics) + "\n")
        return history

    def mean_squared_error(self):
        predicted_value = self.model.predict(self.test_data_features)
        mse = mean_squared_error(np.asmatrix(self.test_data_labels), predicted_value)

        print("========= Mean Square Error Range ===============")
        for i in range(0, 10):
            print(predicted_value[i], "--", np.asmatrix(self.test_data_labels)[i])

    def model_save(self):
        self.model.save('train_models/model_simple.h5')


class PrintDot(Callback):

  def on_epoch_end(self, epoch, logs):
    if epoch % 100 == 0: print('')
    print('.', end='')