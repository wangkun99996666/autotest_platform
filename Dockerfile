FROM python:3.10.13
LABEL org.opencontainers.image.authors="wangkun99996666@gmail.com"
WORKDIR /usr/src/autotest_platform

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN chmod +x run.sh

CMD ["run.sh"]