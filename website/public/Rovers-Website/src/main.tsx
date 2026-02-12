import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 🔍 DEBUG: Log app bootstrap
console.log('🎯 [Rovers-Website] main.tsx - Starting Bootstrap');
console.log('🔍 [Rovers-Website] Document:', {
  readyState: document.readyState,
  URL: document.URL,
  title: document.title,
  referrer: document.referrer || 'none',
});

// Add global error handler - suppress harmless connection errors in development
window.addEventListener('error', (event) => {
  // Suppress known harmless errors
  const errorMessage = event.message || '';
  const isHarmlessError = 
    errorMessage.includes('socket.io') ||
    errorMessage.includes('ERR_CONNECTION_REFUSED') ||
    errorMessage.includes('Stripe') ||
    errorMessage.includes('localhost:3000') ||
    errorMessage.includes('localhost:4444');
  
  if (!isHarmlessError) {
    console.error('❌ [Rovers-Website] Global Error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    });
  }
});

window.addEventListener('unhandledrejection', (event) => {
  // Suppress known harmless promise rejections
  const reason = event.reason?.message || event.reason?.toString() || '';
  const isHarmlessRejection = 
    reason.includes('Stripe') ||
    reason.includes('socket.io') ||
    reason.includes('ERR_CONNECTION_REFUSED') ||
    reason.includes('localhost:3000') ||
    reason.includes('localhost:4444');
  
  if (!isHarmlessRejection) {
    console.error('❌ [Rovers-Website] Unhandled Promise Rejection:', {
      reason: event.reason,
      promise: event.promise,
    });
  }
});

const rootElement = document.getElementById('root');
console.log('🔍 [Rovers-Website] Root element:', rootElement ? 'Found ✅' : 'Not found ❌');

if (rootElement) {
  console.log('🎨 [Rovers-Website] Creating React root and rendering');
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('✅ [Rovers-Website] React app rendered successfully');
} else {
  console.error('❌ [Rovers-Website] CRITICAL: Root element not found!');
}
