
# local imports
from services.student_data_frame_service import StudentDataFrameService
from preprocess.preprocess_main import PreProcess
from neural_network.neural_network import NeuralNetwork
from neural_network.plot_results import PlotResults

# import student data
data_frame_obj = StudentDataFrameService()
data_frame_obj.import_student_data()

# start data pre process
pre_process_obj = PreProcess()
pre_process_obj.start_pre_process()

# build model
neural_network_obj = NeuralNetwork()
neural_network_obj.build_model()
history = neural_network_obj.fit_model()
neural_network_obj.evaluate_model()
neural_network_obj.model_save()

# # plot results
# plot_obj = PlotResults()
# plot_obj.plot_history(history)
# mse
neural_network_obj.mean_squared_error()

# don't close console
input("Press enter to exit ;)")

