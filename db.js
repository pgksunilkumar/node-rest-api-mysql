var db = {};

db.port = 9686;

//Authentication
db.auth = false;

//Database
db.database = 'test';
db.username = 'root';
db.password = '';
db.table_prefix = '';

//Pagination
db.paginate = true;
db.page_limit = 100;

module.exports = db;