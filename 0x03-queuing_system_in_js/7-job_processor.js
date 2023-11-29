import kue from 'kue';

const queue = kue.createQueue();

// Array of blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

// Function to send a notification
const sendNotification = (phoneNumber, message, job, done) => {
  // Track progress
  job.progress(0, 100);

  // Check if phoneNumber is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    job.log(`Phone number ${phoneNumber} is blacklisted`);
    // Fail the job with an error
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }

  // Track progress to 50%
  job.progress(50, 100);

  // Log notification details
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  // Simulate the completion of the notification
  setTimeout(() => {
    // Mark the job as completed
    done();
  }, 1000); // Simulating some processing time
};

// Process jobs in the 'push_notification_code_2' queue with concurrency of 2
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;

  // Call the sendNotification function
  sendNotification(phoneNumber, message, job, done);
});

// Event handler when the queue is idle
queue.on('idle', () => {
  console.log('All jobs have been processed');
  // Exit the process after processing all jobs
  process.exit(0);
});
