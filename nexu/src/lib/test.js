// filepath: d:\Projects\Personality Test\nexu\src\lib\db.test.js
import { saveTestResponse, getTestResponses } from './db.js';
test('saveTestResponse should save data to Supabase', async () => {
  const userId = 'test_user_123';
  const testType = 'personality';
  const responses = { question1: 'A', question2: 'B' };

  const result = await saveTestResponse(userId, testType, responses);
  expect(result).toBeDefined();
  expect(result[0]).toHaveProperty('user_id', userId);
});

test('getTestResponses should fetch data from Supabase', async () => {
  const userId = 'test_user_123';
  const testType = 'personality';

  const result = await getTestResponses(userId, testType);
  expect(result).toBeInstanceOf(Array);
  expect(result[0]).toHaveProperty('user_id', userId);
});