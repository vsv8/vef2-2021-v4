// TODO útfæra proxy virkni
// import { getCachedEarthquakes, setCachedEarthquakes } from './cache.js';
import { timerStart, timerEnd } from './time.js';

import express from 'express';
import fetch from 'node-fetch';

export const router = express.Router();

async function proxy(req, res) {
  const stopwatch = timerStart();
  let { type, period } = req.query;
  const cacheKey = `${type}_${period}`;
  let data;
  let result;

  const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${cacheKey}.geojson`;

  // const cached = await getCachedEarthquakes(cacheKey);

  // if (cached) {
  //   try {
  //     result = JSON.parse(cached);
  //   } catch (err) {
  //     console.warn(`unable to parse cached data, ${cacheKey}, ${err.message}`);
  //     return null;
  //   }
  //   data = {
  //     'data': result,
  //     'info': {
  //       'cached': true,
  //       'elapsed': timerEnd(stopwatch),
  //     },
  //   };
  //   res.json(data);
  //   return;
  // }

  try {
    result = await fetch(URL);
  } catch (err) {
    console.error('Fetch error', err);
  }

  data = {
    'data': result,
    'info': {
      'cached': false,
      'elapsed': timerEnd(stopwatch),
    },
  };

  res.json(data);
}

router.get('/proxy', proxy);
