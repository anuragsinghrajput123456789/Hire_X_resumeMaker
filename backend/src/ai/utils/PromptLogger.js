/**
 * Logger for AI executions to centralize debugging and token tracing.
 */

const logRequest = ({
  requestId,
  promptName,
  promptVersion,
  provider,
  model,
  executionTime,
  retries,
  validationResult,
  error,
  tokenUsage,
  userId
}) => {
  const timestamp = new Date().toISOString();
  
  if (process.env.NODE_ENV === 'production') {
    // Production structured JSON logging (for Logstash, CloudWatch, Datadog)
    const logData = {
      level: error ? 'error' : 'info',
      message: `AI execution: ${promptName}`,
      timestamp,
      requestId: requestId || 'N/A',
      userId: userId || 'Anonymous/Unauthenticated',
      promptName,
      promptVersion: promptVersion || 'unknown',
      provider,
      model,
      executionTimeMs: executionTime,
      retries,
      tokenUsage: tokenUsage || 0,
      validation: validationResult ? {
        isValid: validationResult.isValid,
        errors: validationResult.errors
      } : null,
      status: error ? 'FAILED' : 'SUCCESS',
      error: error ? {
        message: error.message,
        type: error.type || 'AIError',
        statusCode: error.statusCode || 500
      } : null
    };
    console.log(JSON.stringify(logData));
  } else {
    // Development pretty console logging
    console.log(`[AI-LOG] [${timestamp}] RequestId: ${requestId || 'N/A'}`);
    console.log(`  User ID: ${userId || 'Anonymous/Unauthenticated'}`);
    console.log(`  Prompt: ${promptName} (${promptVersion})`);
    console.log(`  Provider: ${provider} | Model: ${model}`);
    console.log(`  Execution Time: ${executionTime}ms | Retries: ${retries} | Estimated Tokens: ${tokenUsage || 0}`);
    if (validationResult) {
      console.log(`  Validation: ${validationResult.isValid ? 'PASSED' : 'FAILED'}`);
      if (!validationResult.isValid) {
        console.log(`  Validation Errors: ${JSON.stringify(validationResult.errors)}`);
      }
    }
    if (error) {
      console.log(`  Error Status: FAILED | Msg: ${error.message} | Type: ${error.type || 'AIError'}`);
    } else {
      console.log(`  Error Status: SUCCESS`);
    }
    console.log('----------------------------------------------------');
  }
};

module.exports = {
  logRequest
};
