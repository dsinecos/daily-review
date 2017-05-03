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


// Inserting dummy data into dailyreview_category table
var insert = [];

insert[0] = "insert into dailyreview_category (category_name, category_label) values ('Ranee', 'Sales')"
insert[1] = "insert into dailyreview_category (category_name, category_label) values ('Hilliard', 'Sales')"
insert[2] = "insert into dailyreview_category (category_name, category_label) values ('Dorette', 'Support')"
insert[3] = "insert into dailyreview_category (category_name, category_label) values ('Rhys', 'Training')"
insert[4] = "insert into dailyreview_category (category_name, category_label) values ('Sheeree', 'Business Development')"
insert[5] = "insert into dailyreview_category (category_name, category_label) values ('Therine', 'Product Management')"
insert[6] = "insert into dailyreview_category (category_name, category_label) values ('Chad', 'Engineering')"
insert[7] = "insert into dailyreview_category (category_name, category_label) values ('Lambert', 'Services')"
insert[8] = "insert into dailyreview_category (category_name, category_label) values ('Gnni', 'Business Development')"
insert[9] = "insert into dailyreview_category (category_name, category_label) values ('Pebrook', 'Support')"

for(var i = 0; i < insert.length; i++) {
    client.query(insert[i]);
}

// Inserting dummy data into dailyreview_users
client.query("insert into dailyreview_users (user_name) values ('Shirley');insert into dailyreview_users (user_name) values ('Gran');insert into dailyreview_users (user_name) values ('Demetris');insert into dailyreview_users (user_name) values ('Stinky');insert into dailyreview_users (user_name) values ('Carolynn');insert into dailyreview_users (user_name) values ('Desmund');insert into dailyreview_users (user_name) values ('Wilbert');insert into dailyreview_users (user_name) values ('Lelia');insert into dailyreview_users (user_name) values ('Delano');insert into dailyreview_users (user_name) values ('Vasily')");

// Inserting dummy data into dailyreview_userdate
client.query("insert into dailyreview_userdate (user_id, dateentry) values (1, '2016-10-11')");
client.query("insert into dailyreview_userdate (user_id, dateentry) values (1, '2016-10-11')");
client.query("insert into dailyreview_userdate (user_id, dateentry) values (2, '2016-10-11')");
client.query("insert into dailyreview_userdate (user_id, dateentry) values (3, '2016-10-11')");
client.query("insert into dailyreview_userdate (user_id, dateentry) values (3, '2016-10-11')");

// Inserting dummy data into dailyreview_score
client.query("insert into dailyreview_score (userdate_id, category_id, score) values (1, 2, 3)");
client.query("insert into dailyreview_score (userdate_id, category_id, score) values (1, 3, 1)");
client.query("insert into dailyreview_score (userdate_id, category_id, score) values (2, 2, 4)");
client.query("insert into dailyreview_score (userdate_id, category_id, score) values (5, 6, 4)");

// Retrieving data from Tables
// Learn how to use multiple joins

// Example Query - SELECT dailyreview_users.user_name as User, dailyreview_category.category_name as Category, dailyreview_userdate.dateentry as DataEntry, dailyreview_score.score as Score FROM dailyreview_users JOIN dailyreview_userdate ON (dailyreview_users.user_id = dailyreview_userdate.user_id) JOIN dailyreview_score ON (dailyreview_userdate.userdate_id = dailyreview_score.userdate_id) JOIN dailyreview_category ON (dailyreview_score.category_id = dailyreview_category.category_id);