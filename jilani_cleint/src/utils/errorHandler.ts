import logger from './logger';

/**
 * Handles and logs client-side errors with detailed information
 */
export const handleError = (error: Error, componentName?: string): void => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    component: componentName || 'Unknown',
    timestamp: new Date().toISOString()
  };

  // Log to application logger
  logger.error(`Client error in ${componentName || 'Unknown component'}`, errorInfo);

  // Additional reporting could be added here (e.g., sending to a server endpoint)
  console.error('Detailed error information:', errorInfo);

  // If it's a network error, provide more specific guidance
  if (error.message.includes('network') || error.message.includes('fetch')) {
    console.error('Network error detected - check server connection');
  }
};

/**
 * Setups window-level error and unhandled rejection listeners
 */
export const setupGlobalErrorHandlers = (): void => {
  window.addEventListener('error', (event) => {
    const error = event.error || new Error(`Resource error: ${event.message}`);
    const errorMessage = error?.message || event.message || '';

    // Ignore localhost:4444 connection errors (development logging service)
    if (errorMessage.includes('localhost:4444') || 
        errorMessage.includes('ERR_CONNECTION_REFUSED')) {
      event.preventDefault();
      return;
    }

    // For resource loading errors
    if (event.target && (
      event.target instanceof HTMLScriptElement ||
      event.target instanceof HTMLLinkElement ||
      event.target instanceof HTMLImageElement
    )) {
      const resourceUrl = event.target instanceof HTMLScriptElement ? event.target.src :
                         event.target instanceof HTMLLinkElement ? event.target.href :
                         event.target instanceof HTMLImageElement ? event.target.src : 'unknown';

      logger.error(`Resource failed to load: ${resourceUrl}`, {
        resourceType: event.target.tagName,
        url: resourceUrl
      });
    } else {
      // For JavaScript errors
      handleError(error, 'global');
    }
  }, true);

  // Handle promise rejection errors
  window.addEventListener('unhandledrejection', (event) => {
    const errorReason = event.reason?.toString() || '';
    
    // Ignore localhost:4444 connection errors (development logging service)
    if (errorReason.includes('localhost:4444') || 
        errorReason.includes('ERR_CONNECTION_REFUSED') ||
        errorReason.includes('Failed to fetch')) {
      event.preventDefault();
      return;
    }

    const error = event.reason instanceof Error ?
      event.reason :
      new Error(errorReason || 'Unknown promise rejection');

    handleError(error, 'unhandled-promise');
  });

  logger.info('Global error handlers initialized');
};

export default {
  handleError,
  setupGlobalErrorHandlers
};