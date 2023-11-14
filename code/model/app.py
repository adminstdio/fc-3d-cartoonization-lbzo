from flask import Flask
from flask import request
from flask import make_response
import cv2
from modelscope.outputs import OutputKeys
from modelscope.pipelines import pipeline
from modelscope.utils.constant import Tasks
from werkzeug.utils import secure_filename
import os
import glob
from flask import render_template

# app = Flask(__name__, 
#             static_url_path='',
#             template_folder='dist', 
#             static_folder='dist',)

app = Flask(__name__)

img_cartoon = 0

async def init_model():
    global img_cartoon
    img_cartoon = pipeline(Tasks.image_portrait_stylization, 
                       model='damo/cv_unet_person-image-cartoon-3d_compound-models')
    return img_cartoon

CACHE_DIR = os.getcwd() + "/img_cache"

init_model()

@app.route("/api/image-stylization", methods=["POST"])
async def image_stylization():
    file = request.files['file']
    filename = secure_filename(file.filename)
    files_to_remove = glob.glob(os.path.join(CACHE_DIR, "*"))
    for f in files_to_remove:
        os.remove(f)
    file.save(os.path.join(CACHE_DIR, filename))
    if (img_cartoon == 0):
        await init_model()
    result = img_cartoon(os.path.join(CACHE_DIR, filename))
    retval, buffer = cv2.imencode('.png', result[OutputKeys.OUTPUT_IMG])
    response = make_response(buffer.tobytes())
    response.headers['Content-Type'] = 'image/png'
    # response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route("/api/keep")
def keep():
    return 'keep'