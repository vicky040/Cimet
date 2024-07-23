import db from '../utils/db';
import User from 'src/models/user';

const getAllUsers = async (): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM users', [], (err, rows: User[]) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
};

const getUserById = async (id: number): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row: User | undefined) => {
      if (err) {
        reject(err);
      }
      resolve(row || null);
    });
  });
};

const createUser = async (user: User): Promise<User> => {
  return new Promise((resolve, reject) => {
    const { givenName, familyName } = user;
    db.run(
      'INSERT INTO users (givenName, familyName) VALUES (?, ?)',
      [givenName, familyName],
      function (this: any, err) {
        if (err) {
          reject(err);
        }
        resolve({ id: this.lastID, givenName, familyName });
      }
    );
  });
};

const updateUser = async (id: number, user: User): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const { givenName, familyName } = user;
    db.run(
      'UPDATE users SET givenName = ?, familyName = ? WHERE id = ?',
      [givenName, familyName, id],
      async function (this: any, err) {
        if (err) {
          reject(err);
        }
        resolve(await getUserById(id));
      }
    );
  });
};

const deleteUser = async (id: number): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    getUserById(id).then((user) => {
      if (user) {
        db.run('DELETE FROM users WHERE id = ?', [id], (err) => {
          if (err) {
            reject(err);
          }
          resolve(user);
        });
      } else {
        resolve(null);
      }
    }).catch(reject);
  });
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
