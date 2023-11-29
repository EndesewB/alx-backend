import kue from 'kue';

const queue = kue.createQueue();

// Sample data for the job
const jobData = {
  phoneNumber: '1234567890',
  message: 'Hello, this is a notification message!',
};

// Create a job in the queue
const job = queue.create('push_notification_code', jobData);

// Event handler when the job is created
job.on('enqueue', () => {
  console.log(`Notification job created: ${job.id}`);
});

// Event handler when the job is completed
job.on('complete', () => {
  console.log('Notification job completed');
  // Remove the completed job from the queue
  job.remove((error) => {
    if (error) throw error;
    process.exit(0);
  });
});

// Event handler when the job fails
job.on('failed', () => {
  console.log('Notification job failed');
  // Remove the failed job from the queue
  job.remove((error) => {
    if (error) throw error;
    process.exit(1);
  });
});

// Save the job to the queue
job.save((error) => {
  if (error) throw error;
});
