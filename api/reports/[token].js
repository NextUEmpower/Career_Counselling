
import { PrismaClient } from '@prisma/client';

// Reuse PrismaClient across lambda invocations to avoid connection exhaustion
// and improve stability on serverless platforms (Vercel, Netlify, etc.).
const prisma = globalThis.__prisma_client || new PrismaClient();
if (!globalThis.__prisma_client) globalThis.__prisma_client = prisma;

export default async function handler(req, res) {
  const { token } = req.query;

  // Token validation
  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    console.error('Invalid token provided:', token);
    return res.status(400).json({ error: 'Invalid token format' });
  }

  const normalizedToken = token.trim().toUpperCase();

  // Quick env validation for deployment issues
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set in environment');
    return res.status(500).json({ error: 'Database not configured: missing DATABASE_URL' });
  }

  if (req.method === 'GET') {
    try {
      // First check if this is a VHSC assessment
      let streamAssessment;
      try {
        streamAssessment = await prisma.streamAssessment.findFirst({
          where: { accessToken: normalizedToken },
        });
      } catch (dbError) {
        console.error('Database error querying streamAssessment for token', normalizedToken, ':', dbError);
        return res.status(500).json({ error: 'Database error while querying stream assessment' });
      }

      if (streamAssessment) {
        // Validate VHSC data structure
        try {
          // Ensure JSON fields are valid
          if (streamAssessment.aptitudeScores && typeof streamAssessment.aptitudeScores !== 'object') {
            throw new Error('Invalid aptitudeScores format');
          }
          if (streamAssessment.interestScores && typeof streamAssessment.interestScores !== 'object') {
            throw new Error('Invalid interestScores format');
          }
          if (streamAssessment.academicPerformance && typeof streamAssessment.academicPerformance !== 'object') {
            throw new Error('Invalid academicPerformance format');
          }
          if (streamAssessment.personalityTraits && typeof streamAssessment.personalityTraits !== 'object') {
            throw new Error('Invalid personalityTraits format');
          }
          if (streamAssessment.contextualInputs && typeof streamAssessment.contextualInputs !== 'object') {
            throw new Error('Invalid contextualInputs format');
          }
        } catch (validationError) {
          console.error('Data validation error for VHSC assessment token', normalizedToken, ':', validationError.message);
          return res.status(500).json({ error: 'Invalid data format in stream assessment' });
        }

        // Return VHSC assessment data
        return res.status(200).json({
          assessmentType: 'vhsc',
          data: streamAssessment,
        });
      }

      // Check if token exists in AccessToken table (for validation)
      let accessToken;
      try {
        accessToken = await prisma.accessToken.findFirst({
          where: { token: normalizedToken },
        });
      } catch (dbError) {
        console.error('Database error querying accessToken for token', normalizedToken, ':', dbError);
        return res.status(500).json({ error: 'Database error while validating access token' });
      }

      if (!accessToken) {
        return res.status(404).json({ error: 'Invalid token' });
      }

      // Otherwise, fetch responses for regular assessment
      let responses;
      try {
        responses = await prisma.response.findMany({
          where: { accessToken: normalizedToken },
          orderBy: { createdAt: 'desc' },
        });
      } catch (dbError) {
        console.error('Database error querying responses for token', normalizedToken, ':', dbError);
        return res.status(500).json({ error: 'Database error while retrieving assessment responses' });
      }

      if (!responses || responses.length === 0) {
        return res.status(404).json({ error: 'No assessment data found' });
      }

      // Data integrity check: ensure responses have required sections
      const requiredSections = ['career', 'personality', 'intelligences', 'learning'];
      const sectionsPresent = new Set(responses.map(r => r.section));
      const missingSections = requiredSections.filter(s => !sectionsPresent.has(s));
      if (missingSections.length > 0) {
        console.warn(`Missing sections for token ${normalizedToken}:`, missingSections);
        // Continue but log warning
      }

      // Group responses by section with validation
      const assessmentData = {};
      for (const resp of responses) {
        if (!resp.section || !resp.answers) {
          console.warn(`Invalid response data for token ${normalizedToken}:`, resp);
          continue; // Skip invalid responses instead of failing
        }

        // Validate answers JSON
        try {
          if (typeof resp.answers !== 'object') {
            throw new Error('Answers must be a valid JSON object');
          }
          // Additional validation can be added here if needed
        } catch (validationError) {
          console.error(`JSON validation error for response ID ${resp.id} in token ${normalizedToken}:`, validationError.message);
          continue; // Skip invalid responses
        }

        assessmentData[resp.section] = resp.answers;
      }

      // Ensure at least one valid section is present
      if (Object.keys(assessmentData).length === 0) {
        return res.status(404).json({ error: 'No valid assessment data found' });
      }

      return res.status(200).json({
        assessmentType: 'general',
        data: assessmentData,
      });
    } catch (error) {
      console.error('Unexpected error retrieving report for token', normalizedToken, ':', error);
      const payload = { error: 'Failed to retrieve report' };
      if (process.env.NODE_ENV !== 'production') {
        payload.details = error?.message;
        payload.code = error?.code;
        payload.stack = error?.stack;
      }
      res.status(500).json(payload);
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
