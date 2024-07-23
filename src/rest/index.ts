
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import apiKeyMiddleware from '../middleware/apiKey'; 
import userService from '../services/userService';
import knex from 'knex';
import logger from '../logger/logger';

const router = express.Router();

router.use(bodyParser.json());
router.use(apiKeyMiddleware);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     security:
 *       - apikeyAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Error retrieving users
 */
router.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    logger.error(`Error retrieving users : ${error} `)
    return res.status(500).json({ message: 'Error retrieving users' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     security:
 *       - apikeyAuth: []
 *     responses:
 *       200:
 *         description: A single user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Error retrieving user
 */
router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    logger.error(`Error retrieving user : ${error}`)
    return res.status(500).json({ message: 'Error retrieving user' });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - apikeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error creating user
 */
router.post('/users', async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    logger.error(`Error create user : ${error}`)
    return res.status(400).json({ message: 'Error creating user' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     security:
 *       - apikeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       400:
 *         description: Error updating user
 */
router.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await userService.updateUser(
      Number(req.params.id),
      req.body
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    logger.error(`Error updating user ${error}`)
    return res.status(400).json({ message: 'Error updating user' });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     security:
 *       - apikeyAuth: []
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 *       500:
 *         description: Error deleting user
 */
router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await userService.deleteUser(Number(req.params.id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    logger.info({message:"user deleted"})
    return res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    logger.error(`Error deleting user: ${error}`)
    return res.status(500).json({ message: 'Error deleting user' });
  }
});

/**
 * @swagger
 * /api/authorship:
 *   post:
 *     summary: Create authorship relationship between user and book
 *     tags: [Authorship]
 *     security:
 *       - apikeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               bookId:
 *                 type: integer
 *             required:
 *               - userId
 *               - bookId
 *     responses:
 *       201:
 *         description: Authorship created successfully
 *       500:
 *         description: Error creating authorship
 */
router.post('/api/authorship', async (req, res) => {
    const { userId, bookId } = req.body;
    
    try {
      await knex('authors_books').insert({ user_id: userId, book_id: bookId });
      res.status(201).send('Authorship created successfully');
    } catch (error) {
    logger.error(`Error creating authorship : ${error}`)
     
      res.status(500).send('Error creating authorship');
    }
  });
  
  

 /**
 * @swagger
 * /api/books/{bookId}/authors:
 *   get:
 *     summary: Retrieve authors of a book by book ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the book
 *     security:
 *       - apikeyAuth: []
 *     responses:
 *       200:
 *         description: List of user IDs who are authors of the book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authors:
 *                   type: array
 *                   items:
 *                     type: integer
 *       500:
 *         description: Error retrieving authors
 */
router.get('/api/books/:bookId/authors', async (req, res) => {
    const { bookId } = req.params;
    
    try {
      const authors = await knex('authors_books')
        .where('book_id', bookId)
        .select('user_id');
      
      res.json({ authors: authors.map(author => author.user_id) });
    } catch (error) {
        logger.error(`Error retrieving authors: ${error}`)
      console.error(error);
      res.status(500).send('Error retrieving authors');
    }
  });
   

 /**
 * @swagger
 * /api/users/{userId}/books:
 *   get:
 *     summary: Retrieve books of a user by user ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user
 *     security:
 *       - apikeyAuth: []
 *     responses:
 *       200:
 *         description: List of book IDs authored by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   items:
 *                     type: integer
 *       500:
 *         description: Error retrieving books
 */
router.get('/api/users/:userId/books', async (req, res) => {
    const { userId } = req.params;
    
    try {
      const books = await knex('authors_books')
        .where('user_id', userId)
        .select('book_id');
      
      res.json({ books: books.map(book => book.book_id) });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving books');
    }
  });
  



export default router;