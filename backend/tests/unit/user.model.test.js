import User from '../../src/models/user.model.js';
import bcrypt from 'bcryptjs';

describe('User Model', () => {
    describe('Schema Validation', () => {
        it('should create a user with valid data', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: await bcrypt.hash('Test@1234', 10)
            };

            const user = new User(userData);
            const savedUser = await user.save();

            expect(savedUser._id).toBeDefined();
            expect(savedUser.name).toBe(userData.name);
            expect(savedUser.email).toBe(userData.email);
            expect(savedUser.role).toBe('user'); // Default role
        });

        it('should fail without required fields', async () => {
            const user = new User({});

            let error;
            try {
                await user.save();
            } catch (e) {
                error = e;
            }

            expect(error).toBeDefined();
            expect(error.errors.name).toBeDefined();
            expect(error.errors.email).toBeDefined();
            expect(error.errors.password).toBeDefined();
        });

        it('should fail with duplicate email', async () => {
            const userData = {
                name: 'Test User',
                email: 'duplicate@example.com',
                password: await bcrypt.hash('Test@1234', 10)
            };

            await new User(userData).save();

            let error;
            try {
                await new User(userData).save();
            } catch (e) {
                error = e;
            }

            expect(error).toBeDefined();
            expect(error.code).toBe(11000); // Duplicate key error
        });

        it('should convert email to lowercase', async () => {
            const userData = {
                name: 'Test User',
                email: 'TEST@EXAMPLE.COM',
                password: await bcrypt.hash('Test@1234', 10)
            };

            const user = await new User(userData).save();
            expect(user.email).toBe('test@example.com');
        });
    });

    describe('Virtual Fields', () => {
        it('should return isLocked as false when lockUntil is not set', async () => {
            const user = new User({
                name: 'Test User',
                email: 'test2@example.com',
                password: await bcrypt.hash('Test@1234', 10)
            });

            expect(user.isLocked).toBe(false);
        });

        it('should return isLocked as true when lockUntil is in the future', async () => {
            const user = new User({
                name: 'Test User',
                email: 'test3@example.com',
                password: await bcrypt.hash('Test@1234', 10),
                lockUntil: new Date(Date.now() + 60000) // 1 minute from now
            });

            expect(user.isLocked).toBe(true);
        });
    });
});
