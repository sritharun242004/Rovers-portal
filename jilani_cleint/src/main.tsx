import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { setupGlobalErrorHandlers } from './utils/errorHandler'
import logger from './utils/logger'
import * as Sentry from "@sentry/react"

// ==========================================
// BLOCK ALL REQUESTS TO LOCALHOST:4444
// This prevents development logging service errors
// ==========================================
const originalFetch = window.fetch;
window.fetch = function(...args: any[]): Promise<Response> {
  const url = args[0]?.toString() || '';
  if (url.includes(':4444') || url.includes('localhost:4444')) {
    console.log('🚫 Blocked fetch request to localhost:4444');
    return Promise.reject(new Error('Blocked localhost:4444 request'));
  }
  return originalFetch.apply(this, args as any);
};

// Also block XMLHttpRequest to localhost:4444
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method: string, url: string, ...rest: any[]): void {
  if (url.includes(':4444') || url.includes('localhost:4444')) {
    console.log('🚫 Blocked XMLHttpRequest to localhost:4444');
    throw new Error('Blocked localhost:4444 request');
  }
  return originalXHROpen.apply(this, [method, url, ...rest] as any);
};
// ==========================================

// Initialize Sentry - DISABLED FOR DEVELOPMENT
// Uncomment for production only
// Sentry.init({
//   dsn: "https://976b780d007ad34611a8ef5478e39471@o4506876750725120.ingest.us.sentry.io/4509189609619456",
//   enabled: import.meta.env.PROD,
// });

// Initialize global error handlers
setupGlobalErrorHandlers();

// Log environment information for debugging
logger.info("=== ENVIRONMENT VARIABLES CHECK ===");
logger.info("VITE_RAZORPAY_KEY_ID:", import.meta.env.VITE_RAZORPAY_KEY_ID ? "Present" : "Missing");
logger.info("All Vite env variables:", Object.keys(import.meta.env)
  .filter(key => key.startsWith('VITE_'))
  .map(key => `${key}: ${import.meta.env[key] ? "Present" : "Missing"}`));

// Additional checks for development environment
if (import.meta.env.DEV) {
  logger.info("Running in development mode");

  // Check if Vite is correctly configured
  if (import.meta.hot) {
    logger.info("HMR is enabled");

    // Set up error handler for HMR errors
    import.meta.hot.on('vite:error', (data) => {
      logger.error(`Vite HMR error: ${data.err.message}`, data.err);
      console.error('Vite error details:', data);
    });
  } else {
    logger.warning("HMR is not available - check Vite configuration");
  }
}

// Try to render the app, but handle potential errors
try {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Root element not found - check your HTML file');
  }

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  logger.info("Application successfully rendered");
} catch (error) {
  // Report to Sentry (disabled in development)
  // Sentry.captureException(error);
  
  logger.error("Failed to render application", error);

  // Display fallback UI
  const rootElement = document.getElementById('root') || document.body;
  const errorMessage = document.createElement('div');
  errorMessage.innerHTML = `
    <div style="padding: 20px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 4px; margin: 20px;">
      <h3>Application Error</h3>
      <p>The application failed to load properly. Please try refreshing the page.</p>
      <p>If the problem persists, contact support.</p>
      <p>Error details: ${error instanceof Error ? error.message : String(error)}</p>
    </div>
  `;
  rootElement.appendChild(errorMessage);
}