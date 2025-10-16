import { redis } from '../lib/redis';

async function testRedis() {
  console.log('Testing Upstash Redis connection...\n');

  try {
    // Set a test value
    await redis.set('test-key', 'Hello Upstash!', { ex: 60 });
    console.log('✅ Set test-key');

    // Get the value
    const value = await redis.get('test-key');
    console.log('✅ Get test-key:', value);

    // Test with JSON
    const jsonData = { name: 'Test', timestamp: Date.now() };
    await redis.set('test-json', JSON.stringify(jsonData), { ex: 60 });
    console.log('✅ Set JSON data');

    const retrieved = await redis.get('test-json');
    const parsed = typeof retrieved === 'string' 
      ? JSON.parse(retrieved) 
      : retrieved;
    console.log('✅ Get JSON data:', parsed);

    // Clean up
    await redis.del('test-key', 'test-json');
    console.log('✅ Cleaned up test keys');

    console.log('\n✅ All tests passed! Upstash is working correctly.');

  } catch (error) {
    console.error('❌ Redis test failed:', error);
  }

  process.exit(0);
}

testRedis();



/* TO TEST RUN-   npx tsx scripts/test-redis.ts   -*/