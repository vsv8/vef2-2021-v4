import redis from 'redis';
import util from 'util';

const redisOptions = {
  url: 'redis://127.0.0.1:6379/0',
};

const client = redis.createClient(redisOptions);

const asyncGet = util.promisify(client.get).bind(client);
const asyncSet = util.promisify(client.set).bind(client);

export async function getCachedEarthquakes(key) {
  const result = await asyncGet(key);
  return result;
}

export async function setCachedEarthquakes(key, earthquakes) {
  await asyncSet(key, earthquakes);
}
