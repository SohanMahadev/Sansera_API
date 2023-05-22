const request = require('supertest');
const app = require('./server');

describe('POST /signup', () => {
    

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        email: 'sohan1234@example.com',
        password: 'password'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User created');
  },10000);

  it('should return 409 if user already exists', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        email: 'sohan1234@gmail.com',
        password: 'password'
      });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });
});

describe('POST /signin', () => {
  it('should authenticate user and return token', async () => {
    const res = await request(app)
      .post('/signin')
      .send({
        email: 'sohan1234@gmail.com',
        password: 'password'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Authentication successful');
    expect(res.body).toHaveProperty('token');
  });

  it('should return 401 if user not found', async () => {
    const res = await request(app)
      .post('/signin')
      .send({
        email: 'nonexistent@example.com',
        password: 'password'
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Authentication failed');
  });

  it('should return 401 if password is incorrect', async () => {
    const res = await request(app)
      .post('/signin')
      .send({
        email: 'sohan1234@gmail.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Authentication failed');
  });
});

describe('POST /topic', () => {
  it('should add a new topic for authenticated user', async () => {
    // create user and authenticate
    const signinRes = await request(app)
      .post('/signin')
      .send({
        email: 'soha1234@gmail.com',
        password: 'password'
      });
    const token = signinRes.body.token;

    // add new topic
    const res = await request(app)
      .post('/topic')
      .set('Authorization', `Bearer ${token}`)
      .send({
        topic: 'Heloo',
        description: 'This is a helooooooooooooooooooooo'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Topic added');
  });

  it('should return 401 if user is not authenticated', async () => {
    const res = await request(app)
      .post('/topic')
      .send({
        topic: 'Test Topic',
        description: 'This is a test topic'
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });
});
