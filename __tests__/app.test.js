require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns todo', async() => {

      const expectation = [
        {
          id: 1,
          todo: 'wash the dishes',
          completed: false,
          user_id: 1
        },
        {
          id: 2,
          todo: 'sweep the floor',
          completed: false,
          user_id: 1
        },
        {
          id: 3,
          todo: 'wash and fold laundry',
          completed: false,
          user_id: 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/todo')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
