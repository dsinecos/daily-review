// Initializing connection with Database and setting up Table
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || "pg://admin:guest@localhost:5432/dailyreview";

var client = new pg.Client(connectionString);
client.connect();

/*
Tables for dailyreview app
 dailyreview_category
 dailyreview_users
 dailyreview_userdate
 dailyreview_score 
*/

client.query("DROP TABLE IF EXISTS dailyreview_category CASCADE");
client.query("DROP TABLE IF EXISTS dailyreview_users CASCADE");
client.query("DROP TABLE IF EXISTS dailyreview_userdate CASCADE");
client.query("DROP TABLE IF EXISTS dailyreview_score CASCADE");

client.query("CREATE TABLE IF NOT EXISTS dailyreview_category(category_id SERIAL PRIMARY KEY, category_name varchar(64), category_label varchar(64))");
client.query("CREATE TABLE IF NOT EXISTS dailyreview_users(user_id SERIAL PRIMARY KEY, user_name varchar(64))");
client.query("CREATE TABLE IF NOT EXISTS dailyreview_userdate(user_id int, FOREIGN KEY (user_id) REFERENCES dailyreview_users(user_id), dateentry date, userdate_id SERIAL PRIMARY KEY)");
client.query("CREATE TABLE IF NOT EXISTS dailyreview_score(userdate_id int, FOREIGN KEY (userdate_id) REFERENCES dailyreview_userdate(userdate_id), category_id int, FOREIGN KEY (category_id) REFERENCES dailyreview_category(category_id), score int)");


