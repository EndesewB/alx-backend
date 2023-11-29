// 100-seat.js

import express from 'express';
import redis from 'redis';
import kue from 'kue';
import { promisify } from 'util';

const app = express();
const port = 1245;

// Redis client setup
const redisClient = redis.createClient();
const promisifiedGet = promisify(redisClient.get).bind(redisClient);
const promisifiedSet = promisify(redisClient.set).bind(redisClient);

// Kue queue setup
const queue = kue.createQueue();

// Initialize available seats and reservation status
let numberOfAvailableSeats = 50;
let reservationEnabled = true;

// Function to reserve a seat
const reserveSeat = async (number) => {
  await promisifiedSet('available_seats', number);
};

// Function to get current available seats
const getCurrentAvailableSeats = async () => {
  const availableSeats = await promisifiedGet('available_seats');
  return parseInt(availableSeats, 10);
};

// Express route to get the number of available seats
app.get('/available_seats', (req, res) => {
  res.json({ numberOfAvailableSeats: numberOfAvailableSeats });
});

// Express route to reserve a seat
app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
    return;
  }

  const job = queue.create('reserve_seat').save((err) => {
    if (err) {
      res.json({ status: 'Reservation failed' });
    } else {
      res.json({ status: 'Reservation in process' });
    }
  });

  // Event handler when the job is completed
  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  // Event handler when the job fails
  job.on('failed', (errorMessage) => {
    console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`);
  });
});

// Express route to process the queue and reserve seats
app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  const currentAvailableSeats = await getCurrentAvailableSeats();
  const job = queue.create('reserve_seat');

  if (currentAvailableSeats === 0) {
    reservationEnabled = false;
  }

  if (currentAvailableSeats >= 1) {
    queue.process('reserve_seat', async (job, done) => {
      await reserveSeat(currentAvailableSeats - 1);
      done();
    });
  } else {
    queue.process('reserve_seat', async (job, done) => {
      done(new Error('Not enough seats available'));
    });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
