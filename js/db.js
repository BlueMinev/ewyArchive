// load sqlite3, provide extra info for debugging
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite', (err) => {
if (err) {
console.error(err.message);
throw err;
} else {
console.log('Connected to SQLite database');
// create table (throws error if already exists)
db.run(`CREATE TABLE ewyArchive (
eventID INTEGER PRIMARY KEY AUTOINCREMENT,
title text,
image text,
description text,
date date
)`,
(err) => {
if (err) {
console.error('Table comments already exists');
}else{
console.error('Table comments created');
// insert some test data
const insert = 'INSERT INTO ewyArchive (title,image,description,date)VALUES (?,?,?,?)';
db.run(insert, ['Ewy archive created', 'https://media.discordapp.net/attachments/802621805013237771/1296239307916578856/IMG_2695.png', 'woagh its alive!!!','2024-10-18']);
db.run(insert, ['oo this is test data', 'https://media.discordapp.net/attachments/802621805013237771/1295919827403280434/image.png', 'another comment','2009-10-19']);
}
});
}
});
module.exports = db