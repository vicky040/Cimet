import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(':memory:');

// db.serialize(() => {
//   db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, givenName TEXT, familyName TEXT)');
// });

export default db;


