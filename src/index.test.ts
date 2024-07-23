import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import userService from './services/userService';
import apiKeyMiddleware from './middleware/apiKey';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(apiKeyMiddleware);

app.get('/users', async (_req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
});

app.get('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10); 
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  const user = await userService.getUserById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json(user);
  return;
});

app.post('/users', async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
});

app.put('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10); 
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  const user = await userService.updateUser(userId, req.body);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json(user);
  return;
});

app.delete('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10); 
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  const user = await userService.deleteUser(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ message: 'User deleted' });
  return;
});

// Tests
describe('User API', () => {
  const apiKey = process.env.API_KEY as string; // Ensure API_KEY is defined

  it('should get all users', async () => {
    const response = await request(app).get('/users').set('api-key', apiKey);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
  });

  it('should get a user by ID', async () => {
    const response = await request(app).get('/users/1').set('api-key', apiKey);
    if (response.status === 200) {
      expect(response.body).toHaveProperty('id', 1);
    } else {
      expect(response.status).toBe(404);
    }
  });

  it('should create a new user', async () => {
    const response = await request(app).post('/users').set('api-key', apiKey).send({
      givenName: 'Test',
      familyName: 'User',
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should update a user by ID', async () => {
    const response = await request(app).put('/users/1').set('api-key', apiKey).send({
      givenName: 'Updated',
      familyName: 'User',
    });
    if (response.status === 200) {
      expect(response.body).toHaveProperty('givenName', 'Updated');
    } else {
      expect(response.status).toBe(404);
    }
  });

  it('should delete a user by ID', async () => {
    const response = await request(app).delete('/users/1').set('api-key', apiKey);
    if (response.status === 200) {
      expect(response.body).toHaveProperty('message', 'User deleted');
    } else {
      expect(response.status).toBe(404);
    }
  });
});
