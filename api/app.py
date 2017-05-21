from flask import Flask, request
from flask_restful import Resource, Api
import json
import os
import psycopg2

CONNECTION_STRING = "dbname='DocApp' user='Superuser' host='localhost' password='pickles48'"

app = Flask(__name__)
api = Api(app)

class Users_Meta(Resource):
  def get(self):
    #Connect to databse
    #conn = e.connect()
    conn = psycopg2.connect(CONNECTION_STRING)
    #Perform query and return JSON data
    #query = conn.execute("select * from Users")
    cur = conn.cursor()
    cur.execute('select * from "Users"')
    users = []
    #for i in query.cursor.fetchall():
    for i in cur.fetchall():
      users.append({
        'username': i[0],
        'email': i[1],
        'firstName': i[2],
        'middleName': i[3],
        'lastName': i[4]
      })

    return { 'users': users }

api.add_resource(Users_Meta, '/users')

if __name__ == '__main__':
  app.run()