FROM python:3.9-buster

WORKDIR /etc/image-stylization

EXPOSE 8080

RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple 

# RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

RUN pip install dashscope==1.0.3 \
    Flask==2.2.3 \
    numpy==1.23.5 \
    opencv-python-headless==4.7.0.72 \
    modelscope==1.5.2 \
    torch==2.0.0 \
    torchaudio==2.0.1 \
    torchvision==0.15.1 \
    tensorflow==2.12.0 \
    easydict==1.10

RUN pip install flask[async]

COPY . .

RUN python3 model_cache.py

ENTRYPOINT ["flask", "run", "--host", "0.0.0.0", "--port", "8080"]