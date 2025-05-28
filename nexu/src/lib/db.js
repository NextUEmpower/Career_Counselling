import { supabase } from '../../supaBaseClient';
export async function saveTestResponse(userId, testType, responses) {
  try {
    const { data, error } = await supabase.from('test_responses').insert([
      {
        user_id: userId, // Ensure your Supabase table has a column named `user_id`
        test_type: testType, // Ensure your Supabase table has a column named `test_type`
        responses: JSON.stringify(responses), // Store responses as a JSON string
        created_at: new Date().toISOString(), // Optional: Add a timestamp
      },
    ]);

    if (error) {
      console.error('Error saving test response:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error saving test response:', error);
    throw error;
  }
}

export async function getTestResponses(userId, testType) {
  try {
    const { data, error } = await supabase
      .from('test_responses')
      .select('*')
      .eq('user_id', userId)
      .eq('test_type', testType)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching test responses:', error);
      throw error;
    }

    // Parse the JSON responses before returning
    return data.map((response) => ({
      ...response,
      responses: JSON.parse(response.responses),
    }));
  } catch (error) {
    console.error('Unexpected error fetching test responses:', error);
    throw error;
  }
}

import { saveTestResponse, getTestResponses } from './db';

async function testIntegration() {
  const userId = 'test_user_123';
  const testType = 'personality';
  const responses = { question1: 'A', question2: 'B', question3: 'C' };

  console.log('Testing saveTestResponse...');
  try {
    const saveResult = await saveTestResponse(userId, testType, responses);
    console.log('saveTestResponse result:', saveResult);
  } catch (error) {
    console.error('Error in saveTestResponse:', error);
  }

  console.log('Testing getTestResponses...');
  try {
    const fetchResult = await getTestResponses(userId, testType);
    console.log('getTestResponses result:', fetchResult);
  } catch (error) {
    console.error('Error in getTestResponses:', error);
  }
}

testIntegration();