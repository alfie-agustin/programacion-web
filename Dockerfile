FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r ./requirements.txt

RUN mkdir /.surprise_data && chmod -R 777 /.surprise_data

COPY . .

CMD ["gunicorn", "-b", "0.0.0.0:7860", "app:app"]