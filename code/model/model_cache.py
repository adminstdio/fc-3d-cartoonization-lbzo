from modelscope.outputs import OutputKeys
from modelscope.pipelines import pipeline
from modelscope.utils.constant import Tasks

pipeline(Tasks.image_portrait_stylization, 
                       model='damo/cv_unet_person-image-cartoon-3d_compound-models')