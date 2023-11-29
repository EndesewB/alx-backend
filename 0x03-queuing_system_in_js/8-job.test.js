// 8-job.test.js

import kue from 'kue';
import chai from 'chai';
import createPushNotificationsJobs from './8-job.js';

const expect = chai.expect;

describe('createPushNotificationsJobs', () => {
  let queue;

  beforeEach(() => {
    // Create a Kue queue in test mode
    queue = kue.createQueue({ disableSearch: true, jobEvents: false });
    queue.testMode.enter();
  });

  afterEach(() => {
    // Clear the queue and exit test mode
    queue.testMode.clear();
    queue.testMode.exit();
  });

  it('should display an error message if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs({}, queue)).to.throw('Jobs is not an array');
  });

  it('should create two new jobs to the queue', () => {
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account',
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 5678 to verify your account',
      },
    ];

    createPushNotificationsJobs(jobs, queue);

    // Assert that two jobs are created in the queue
    expect(queue.testMode.jobs.length).to.equal(2);

    // Validate the properties of the first job
    const firstJob = queue.testMode.jobs[0];
    expect(firstJob.type).to.equal('push_notification_code_3');
    expect(firstJob.data.phoneNumber).to.equal('4153518780');
    expect(firstJob.data.message).to.equal('This is the code 1234 to verify your account');

    // Validate the properties of the second job
    const secondJob = queue.testMode.jobs[1];
    expect(secondJob.type).to.equal('push_notification_code_3');
    expect(secondJob.data.phoneNumber).to.equal('4153518781');
    expect(secondJob.data.message).to.equal('This is the code 5678 to verify your account');
  });
});

