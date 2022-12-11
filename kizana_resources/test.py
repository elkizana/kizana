# Importing Sqlite3 Module
import sqlite3
import os.path
i = 0
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, "kizana_all_books.sqlite")
with sqlite3.connect(db_path) as db:
    cursor = db.cursor()
    res = cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    for name in res.fetchall():
        
        cursor.execute("select * from {}".format(name[0])  )
        results = cursor.fetchall()
        if len(results) > 5000 and  name[0].startswith("t") :
            #print ( len(results))
            i += 1
            print( i  )
        # print(name[0])
