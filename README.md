# node-rest-api-mysql
This is a simple REST API with node and express with mysql Database
- REST ful
- Basic API Authentication
- SQL Injection cleaning 
- Easy to setup

##To setup a DB file first

```
db.port = 9686;

//Authentication
db.auth = false;

//Database
db.database = 'databaseName';
db.username = 'databaseUserName';
db.password = 'databasePassword';
db.table_prefix = '';

```

##Create a values in Table (POST)

Create a new entry in the table with the parameters that are posted.

```
POST http://localhost:9686/api/database_table
```


##GET all values in Table (GET)

Read Entire Table.

```
GET http://localhost:9686/api/database_table
```
