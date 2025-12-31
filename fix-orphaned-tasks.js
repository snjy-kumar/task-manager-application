// Quick script to fix orphaned tasks
// Run this in browser console while logged in

(async function () {
    console.log('🔧 FIXING ORPHANED TASKS');
    console.log('========================\n');

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    console.log('Your User ID:', user._id);
    console.log('\nThis script will assign all orphaned tasks (without user field) to your account.');
    console.log('Or you can choose to delete them instead.\n');

    // Fetch current tasks
    const response = await fetch('http://localhost:5000/api/v1/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const tasks = await response.json();
    console.log('Tasks currently visible to you:', tasks.length);
    console.log('\nYou have 10 orphaned tasks in the database that are invisible.');
    console.log('\nWhat do you want to do?');
    console.log('1. Assign them to your account (they\'ll become visible)');
    console.log('2. Delete them permanently');
    console.log('\nTo execute:');
    console.log('- Copy one of the MongoDB commands below');
    console.log('- Open MongoDB Compass or Mongo Shell');
    console.log('- Paste and run the command\n');

    console.log('--- OPTION 1: ASSIGN TO YOUR ACCOUNT ---');
    console.log(`db.tasks.updateMany(
  { user: null },
  { $set: { user: ObjectId("${user._id}") } }
)`);

    console.log('\n--- OPTION 2: DELETE ORPHANED TASKS ---');
    console.log(`db.tasks.deleteMany({ user: null })`);

    console.log('\n========================');
    console.log('After running the command, refresh your tasks page!');
})();
