// TODO útfæra proxy virkni
import express from 'express';
import fetch from 'node-fetch';

import { getCachedEarthquakes, setCachedEarthquakes } from './cache.js';
import { timerStart, timerEnd } from './time.js';

export const router = express.Router();

async function proxy(req, res) {
  const stopwatch = timerStart();
  const { type, period } = req.query;
  const cacheKey = `${type}_${period}`;
  let data;
  let result;

  const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${cacheKey}.geojson`;

  const cached = await getCachedEarthquakes(cacheKey);

  if (cached) {
    try {
      result = JSON.parse(cached);
    } catch (err) {
      console.warn(`unable to parse cached data, ${cacheKey}, ${err.message}`);
      return null;
    }
    data = {
      data: result,
      info: {
        cached: true,
        elapsed: timerEnd(stopwatch),
      },
    };
    return res.json(data);
  }

  try {
    result = await fetch(URL);
  } catch (err) {
    console.error('Fetch error', err);
  }

  if (!result.ok) {
    return console.error('Result error', await result.text());
  }

  const resultText = await result.text();
  await setCachedEarthquakes(cacheKey, resultText);

  try {
    result = JSON.parse(resultText);
  } catch (err) {
    console.warn(`unable to parse cached data, ${cacheKey}, ${err.message}`);
    return null;
  }

  data = {
    data: resultText,
    info: {
      cached: false,
      elapsed: timerEnd(stopwatch),
    },
  };
  return res.json(data);
}

router.get('/proxy', proxy);
