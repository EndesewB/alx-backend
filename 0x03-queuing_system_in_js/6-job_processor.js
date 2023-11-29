import kue from 'kue';

const queue = kue.createQueue();

// Function to send a notification
const sendNotification = (phoneNumber, message) => {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
};

// Process jobs in the 'push_notification_code' queue
queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;

  // Call the sendNotification function
  sendNotification(phoneNumber, message);

  // Notify Kue that the job is done
  done();
});

// Event handler when the queue is idle
queue.on('idle', () => {
  console.log('All jobs have been processed');
  // Exit the process after processing all jobs
  process.exit(0);
});
