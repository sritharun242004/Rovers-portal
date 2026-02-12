import logger from './logger';

interface NetworkMetrics {
  latency: number;
  success: boolean;
  timestamp: string;
  error?: string;
}

/**
 * Utility class for diagnosing network issues
 */
export class NetworkDiagnostics {
  private static metrics: NetworkMetrics[] = [];
  private static maxStoredMetrics = 50;
  private static isCheckingConnection = false;
  private static connectedCallback: ((isConnected: boolean) => void) | null = null;

  /**
   * Measures latency to a given endpoint
   * @param url The URL to measure latency to
   * @returns Promise with latency in milliseconds
   */
  public static async measureLatency(url: string = '/api/diagnostics/health'): Promise<number> {
    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 10 second timeout
      
      const response = await fetch(url, { 
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const endTime = performance.now();
      const latency = endTime - startTime;
      
      this.recordMetric({
        latency,
        success: response.ok,
        timestamp: new Date().toISOString()
      });
      
      logger.info(`Network latency to ${url}: ${latency.toFixed(2)}ms`);
      return latency;
    } catch (error) {
      const endTime = performance.now();
      const latency = endTime - startTime;
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      this.recordMetric({
        latency,
        success: false,
        timestamp: new Date().toISOString(),
        error: errorMessage
      });
      
      logger.error(`Network latency measurement failed for ${url}`, {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        latency
      });
      
      return -1; // Return negative value to indicate error
    }
  }

  /**
   * Records a network metric
   * @param metric The network metric to record
   */
  private static recordMetric(metric: NetworkMetrics): void {
    this.metrics.unshift(metric);
    
    // Keep only the most recent metrics
    if (this.metrics.length > this.maxStoredMetrics) {
      this.metrics = this.metrics.slice(0, this.maxStoredMetrics);
    }
  }

  /**
   * Gets all recorded metrics
   * @returns Array of recorded metrics
   */
  public static getMetrics(): NetworkMetrics[] {
    return [...this.metrics];
  }

  /**
   * Gets the average latency from recorded metrics
   * @param onlySuccessful Whether to only include successful requests
   * @returns The average latency in milliseconds
   */
  public static getAverageLatency(onlySuccessful: boolean = true): number {
    const filteredMetrics = onlySuccessful 
      ? this.metrics.filter(m => m.success) 
      : this.metrics;
    
    if (filteredMetrics.length === 0) return 0;
    
    const sum = filteredMetrics.reduce((acc, metric) => acc + metric.latency, 0);
    return sum / filteredMetrics.length;
  }

  /**
   * Gets the success rate of network requests
   * @returns Percentage of successful requests (0-100)
   */
  public static getSuccessRate(): number {
    if (this.metrics.length === 0) return 0;
    
    const successfulRequests = this.metrics.filter(m => m.success).length;
    return (successfulRequests / this.metrics.length) * 100;
  }

  /**
   * Runs a comprehensive network diagnostics test
   * @returns Object containing test results
   */
  public static async runDiagnostics(): Promise<{
    apiLatency: number;
    databaseConnected: boolean;
    systemInfo: any;
    successRate: number;
    isConnected: boolean;
  }> {
    logger.info('Starting comprehensive network diagnostics...');
    
    try {
      // Test 1: API Health Check
      const apiLatency = await this.measureLatency('/api/diagnostics/health');
      
      // Test 2: Database Connection Check
      let databaseConnected = false;
      try {
        const dbResponse = await fetch('/api/diagnostics/database', { 
          headers: { 'Cache-Control': 'no-cache' } 
        });
        const dbData = await dbResponse.json();
        databaseConnected = dbData.connected;
      } catch (error) {
        logger.error('Database connectivity check failed', error);
      }
      
      // Test 3: System Info Check
      let systemInfo = null;
      try {
        const sysResponse = await fetch('/api/diagnostics/system', { 
          headers: { 'Cache-Control': 'no-cache' } 
        });
        systemInfo = await sysResponse.json();
      } catch (error) {
        logger.error('System info check failed', error);
        systemInfo = { error: 'Failed to retrieve system info' };
      }
      
      // Calculate success rate
      const successRate = this.getSuccessRate();
      
      // Check if connected
      const isConnected = apiLatency > 0;
      
      logger.info('Network diagnostics completed', {
        apiLatency,
        databaseConnected,
        successRate,
        isConnected
      });
      
      return {
        apiLatency,
        databaseConnected,
        systemInfo,
        successRate,
        isConnected
      };
    } catch (error) {
      logger.error('Comprehensive network diagnostics failed', error);
      throw error;
    }
  }

  /**
   * Checks if the application is connected to the internet and server
   * @returns Promise<boolean> indicating if connected
   */
  public static async checkConnection(): Promise<boolean> {
    try {
      const latency = await this.measureLatency();
      return latency > 0;
    } catch (error) {
      logger.error('Connection check failed', error);
      return false;
    }
  }

  /**
   * Sets up continuous connection monitoring
   * @param callback Function to call when connection status changes
   * @param intervalMs How often to check connection (default: 30 seconds)
   */
  public static monitorConnection(
    callback: (isConnected: boolean) => void,
    intervalMs: number = 30000
  ): () => void {
    if (this.isCheckingConnection) {
      logger.warn('Connection monitoring already in progress. Updating callback and interval.');
    }
    
    this.connectedCallback = callback;
    this.isCheckingConnection = true;
    
    // Check initial state immediately
    this.checkConnection().then(isConnected => {
      if (this.connectedCallback) {
        this.connectedCallback(isConnected);
      }
    });
    
    // Set up interval for regular checks
    const intervalId = setInterval(async () => {
      try {
        const isConnected = await this.checkConnection();
        
        if (this.connectedCallback) {
          this.connectedCallback(isConnected);
        }
      } catch (error) {
        logger.error('Error in connection monitoring interval', error);
        
        if (this.connectedCallback) {
          this.connectedCallback(false);
        }
      }
    }, intervalMs);
    
    // Return function to stop monitoring
    return () => {
      clearInterval(intervalId);
      this.isCheckingConnection = false;
      this.connectedCallback = null;
      logger.info('Connection monitoring stopped');
    };
  }

  /**
   * Detects if there are potential network issues based on metrics
   * @returns True if network issues are detected
   */
  public static hasNetworkIssues(): boolean {
    if (this.metrics.length < 3) return false;
    
    // Check for low success rate
    if (this.getSuccessRate() < 70) return true;
    
    // Check for high latency
    const avgLatency = this.getAverageLatency();
    if (avgLatency > 500) return true;
    
    // Check for recent failures
    const recentMetrics = this.metrics.slice(0, 3);
    const recentFailures = recentMetrics.filter(m => !m.success).length;
    if (recentFailures >= 2) return true;
    
    return false;
  }

  /**
   * Clears all stored metrics
   */
  public static clearMetrics(): void {
    this.metrics = [];
    logger.info('Network metrics cleared');
  }
}

export default NetworkDiagnostics;