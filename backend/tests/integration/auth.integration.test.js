import request from 'supertest';
import app from '../../app.js';
import User from '../../src/models/user.model.js';

describe('Authentication Integration Tests', () => {
    beforeEach(async () => {
        // Clear users before each test
        await User.deleteMany({});
    });

    describe('POST /api/v1/auth/register', () => {
        it('should register a new user with valid data', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'SecurePass123!'
            };

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.user).toHaveProperty('_id');
            expect(response.body.user.email).toBe(userData.email.toLowerCase());
            expect(response.body.user.name).toBe(userData.name);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).not.toHaveProperty('password');
        });

        it('should not register user with existing email', async () => {
            const userData = {
                name: 'Test User',
                email: 'duplicate@example.com',
                password: 'SecurePass123!'
            };

            // Register first user
            await request(app)
                .post('/api/v1/auth/register')
                .send(userData)
                .expect(201);

            // Try to register with same email
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(userData)
                .expect(409);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('already exists');
        });

        it('should hash password before saving', async () => {
            const userData = {
                name: 'Test User',
                email: 'hash@example.com',
                password: 'PlainPassword123!'
            };

            await request(app)
                .post('/api/v1/auth/register')
                .send(userData);

            const user = await User.findOne({ email: userData.email }).select('+password');
            expect(user.password).not.toBe(userData.password);
            expect(user.password).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
        });
    });

    describe('POST /api/v1/auth/login', () => {
        beforeEach(async () => {
            // Create a test user before each login test
            await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: 'Login Test User',
                    email: 'login@example.com',
                    password: 'TestPass123!'
                });
        });

        it('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'TestPass123!'
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user.email).toBe('login@example.com');
            expect(response.headers['set-cookie']).toBeDefined();
        });

        it('should reject login with invalid password', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'WrongPassword'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Invalid password');
        });

        it('should reject login with non-existent email', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'SomePassword123'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Invalid credentials');
        });

        it('should lock account after 5 failed login attempts', async () => {
            // Attempt 5 failed logins
            for (let i = 0; i < 5; i++) {
                await request(app)
                    .post('/api/v1/auth/login')
                    .send({
                        email: 'login@example.com',
                        password: 'WrongPassword'
                    });
            }

            // 6th attempt should result in locked account
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'WrongPassword'
                })
                .expect(423);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('locked');
        });
    });

    describe('GET /api/v1/auth/profile', () => {
        let authToken;

        beforeEach(async () => {
            // Register and login to get token
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: 'Profile Test User',
                    email: 'profile@example.com',
                    password: 'TestPass123!'
                });
            
            authToken = response.body.token;
        });

        it('should get user profile with valid token', async () => {
            const response = await request(app)
                .get('/api/v1/auth/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.user).toHaveProperty('_id');
            expect(response.body.user.email).toBe('profile@example.com');
            expect(response.body.user).not.toHaveProperty('password');
        });

        it('should reject request without token', async () => {
            const response = await request(app)
                .get('/api/v1/auth/profile')
                .expect(401);

            expect(response.body.success).toBe(false);
        });

        it('should reject request with invalid token', async () => {
            const response = await request(app)
                .get('/api/v1/auth/profile')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/auth/logout', () => {
        it('should logout and clear refresh token cookie', async () => {
            const response = await request(app)
                .post('/api/v1/auth/logout')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('Logged out');
            
            const cookies = response.headers['set-cookie'];
            if (cookies) {
                const refreshTokenCookie = cookies.find(cookie => cookie.includes('refreshToken'));
                expect(refreshTokenCookie).toBeDefined();
            }
        });
    });
});
