import Task from '../../src/models/task.model.js';
import User from '../../src/models/user.model.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

describe('Task Model', () => {
    let testUser;

    beforeEach(async () => {
        // Create a test user for task ownership
        testUser = await new User({
            name: 'Test User',
            email: 'tasktest@example.com',
            password: await bcrypt.hash('Test@1234', 10)
        }).save();
    });

    describe('Schema Validation', () => {
        it('should create a task with valid data', async () => {
            const taskData = {
                title: 'Test Task',
                description: 'Test Description',
                dueDate: new Date(Date.now() + 86400000), // Tomorrow
                user: testUser._id
            };

            const task = await new Task(taskData).save();

            expect(task._id).toBeDefined();
            expect(task.title).toBe(taskData.title);
            expect(task.status).toBe('Pending'); // Default
            expect(task.priority).toBe('Medium'); // Default
        });

        it('should fail without required fields', async () => {
            const task = new Task({});

            let error;
            try {
                await task.save();
            } catch (e) {
                error = e;
            }

            expect(error).toBeDefined();
            expect(error.errors.title).toBeDefined();
            expect(error.errors.description).toBeDefined();
            expect(error.errors.dueDate).toBeDefined();
            expect(error.errors.user).toBeDefined();
        });

        it('should validate status enum values', async () => {
            const taskData = {
                title: 'Test Task',
                description: 'Test Description',
                dueDate: new Date(),
                user: testUser._id,
                status: 'InvalidStatus'
            };

            let error;
            try {
                await new Task(taskData).save();
            } catch (e) {
                error = e;
            }

            expect(error).toBeDefined();
            expect(error.errors.status).toBeDefined();
        });

        it('should validate priority enum values', async () => {
            const taskData = {
                title: 'Test Task',
                description: 'Test Description',
                dueDate: new Date(),
                user: testUser._id,
                priority: 'InvalidPriority'
            };

            let error;
            try {
                await new Task(taskData).save();
            } catch (e) {
                error = e;
            }

            expect(error).toBeDefined();
            expect(error.errors.priority).toBeDefined();
        });
    });

    describe('Virtual Fields', () => {
        it('should calculate isOverdue correctly for overdue tasks', async () => {
            const task = new Task({
                title: 'Overdue Task',
                description: 'Test',
                dueDate: new Date(Date.now() - 86400000), // Yesterday
                user: testUser._id,
                status: 'Pending'
            });

            expect(task.isOverdue).toBe(true);
        });

        it('should not be overdue for completed tasks', async () => {
            const task = new Task({
                title: 'Completed Task',
                description: 'Test',
                dueDate: new Date(Date.now() - 86400000), // Yesterday
                user: testUser._id,
                status: 'Completed'
            });

            expect(task.isOverdue).toBe(false);
        });

        it('should calculate daysUntilDue correctly', async () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(12, 0, 0, 0);

            const task = new Task({
                title: 'Future Task',
                description: 'Test',
                dueDate: tomorrow,
                user: testUser._id
            });

            expect(task.daysUntilDue).toBeGreaterThanOrEqual(0);
            expect(task.daysUntilDue).toBeLessThanOrEqual(2);
        });
    });

    describe('Static Methods', () => {
        it('should get task stats', async () => {
            // Create test tasks
            await Task.create([
                { title: 'Task 1', description: 'Test', dueDate: new Date(), user: testUser._id, status: 'Pending' },
                { title: 'Task 2', description: 'Test', dueDate: new Date(), user: testUser._id, status: 'Completed' },
                { title: 'Task 3', description: 'Test', dueDate: new Date(), user: testUser._id, status: 'In Progress' },
            ]);

            const stats = await Task.getStats(testUser._id);

            expect(stats.total).toBe(3);
            expect(stats.pending).toBe(1);
            expect(stats.completed).toBe(1);
            expect(stats.inProgress).toBe(1);
        });

        it('should paginate tasks correctly', async () => {
            // Create 15 test tasks
            const tasks = Array.from({ length: 15 }, (_, i) => ({
                title: `Task ${i + 1}`,
                description: 'Test',
                dueDate: new Date(),
                user: testUser._id
            }));
            await Task.insertMany(tasks);

            const result = await Task.findPaginated(
                { user: testUser._id },
                { page: 1, limit: 10 }
            );

            expect(result.tasks.length).toBe(10);
            expect(result.pagination.total).toBe(15);
            expect(result.pagination.pages).toBe(2);
            expect(result.pagination.hasNext).toBe(true);
        });
    });

    describe('Middleware', () => {
        it('should set completedAt when status changes to Completed', async () => {
            const task = await new Task({
                title: 'Test Task',
                description: 'Test',
                dueDate: new Date(),
                user: testUser._id,
                status: 'Pending'
            }).save();

            expect(task.completedAt).toBeUndefined();

            task.status = 'Completed';
            await task.save();

            expect(task.completedAt).toBeDefined();
        });
    });
});
