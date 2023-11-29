import kue from 'kue';

const queue = kue.createQueue();

const jobs = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account',
  },
  {
    phoneNumber: '4153518781',
    message: 'This is the code 4562 to verify your account',
  },
  // ... (add other job data)
];

// Function to create jobs in the queue
const createJob = (jobData) => {
  const job = queue.create('push_notification_code_2', jobData);

  // Event handler when the job is created
  job.on('enqueue', () => {
    console.log(`Notification job created: ${job.id}`);
  });

  // Event handler when the job is completed
  job.on('complete', () => {
    console.log(`Notification job ${job.id} completed`);
  });

  // Event handler when the job fails
  job.on('failed', (errorMessage) => {
    console.log(`Notification job ${job.id} failed: ${errorMessage}`);
  });

  // Event handler for job progress
  job.on('progress', (progress, data) => {
    console.log(`Notification job ${job.id} ${progress}% complete`);
  });

  // Save the job to the queue
  job.save((error) => {
    if (error) throw error;
  });
};

// Loop through the array and create jobs
jobs.forEach((jobData, index) => {
  createJob(jobData);
});

// Event handler when the queue is idle
queue.on('idle', () => {
  console.log('All jobs have been processed');
  // Exit the process after processing all jobs
  process.exit(0);
});
