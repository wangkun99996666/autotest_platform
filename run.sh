#!/bin/bash

# 定义 Python 文件和 Gunicorn 配置文件的路径
python_file="core.py"
# gunicorn 配置文件
# gunicorn_config="/path/to/your/gunicorn_config.py"

# 运行 Python 文件
python3 "$python_file" &

# 等待一段时间以确保 Python 服务已经启动
sleep 3

# 使用 Gunicorn 启动服务器
gunicorn -w 4 -b 0.0.0.0:5000 app:app
