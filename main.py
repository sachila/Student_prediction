
# local imports
from services.student_data_frame_service import StudentDataFrameService
from preprocess.preprocess_main import PreProcess

# import student data
data_frame_obj = StudentDataFrameService()
data_frame_obj.import_student_data()

# start data pre process
pre_process_obj = PreProcess()
pre_process_obj.start_pre_process()
# don't close console
input("Press enter to exit ;)")

