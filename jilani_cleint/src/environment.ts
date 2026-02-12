// Environment configuration
interface Environment {
  production: boolean;
  apiUrl: string;
  razorpayKeyId: string;
  defaultCurrency: string;
  websocketUrl: string;
}

const environment: Environment = {
  production: import.meta.env.PROD || false,
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  razorpayKeyId: 'rzp_test_pZdOFHgBpK0oDz', // Hardcode the test key for now
  defaultCurrency: 'RS', // Default currency set to RS (Dubai Dirhams)
  websocketUrl: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3000'
};

export default environment;