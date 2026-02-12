/**
 * Logger utility for consistent logging across the application
 */

interface LogOptions {
  /**
   * Whether to include a timestamp with the log
   */
  timestamp?: boolean;
  
  /**
   * Whether to include the log level with the log
   */
  level?: boolean;
  
  /**
   * The module or component that is logging
   */
  module?: string;
}

const defaultOptions: LogOptions = {
  timestamp: true,
  level: true,
  module: 'app',
};

/**
 * Formats a log message with optional timestamp, level, and module
 */
const formatLog = (message: string, level: string, options: LogOptions): string => {
  const parts: string[] = [];
  
  if (options.timestamp) {
    parts.push(`[${new Date().toISOString()}]`);
  }
  
  if (options.level) {
    parts.push(`[${level}]`);
  }
  
  if (options.module) {
    parts.push(`[${options.module}]`);
  }
  
  parts.push(message);
  return parts.join(' ');
};

/**
 * Log an info message
 */
export const logInfo = (message: string, data?: any, options: LogOptions = {}): void => {
  const mergedOptions = { ...defaultOptions, ...options };
  console.log(formatLog(message, 'INFO', mergedOptions), data !== undefined ? data : '');
};

/**
 * Log a debug message
 */
export const logDebug = (message: string, data?: any, options: LogOptions = {}): void => {
  if (import.meta.env.DEV) {
    const mergedOptions = { ...defaultOptions, ...options };
    console.debug(formatLog(message, 'DEBUG', mergedOptions), data !== undefined ? data : '');
  }
};

/**
 * Log a warning message
 */
export const logWarning = (message: string, data?: any, options: LogOptions = {}): void => {
  const mergedOptions = { ...defaultOptions, ...options };
  console.warn(formatLog(message, 'WARNING', mergedOptions), data !== undefined ? data : '');
};

/**
 * Log an error message
 */
export const logError = (message: string, error?: any, options: LogOptions = {}): void => {
  const mergedOptions = { ...defaultOptions, ...options };
  console.error(formatLog(message, 'ERROR', mergedOptions), error || '');
  
  // If we have an error object, log the stack trace
  if (error && error.stack) {
    console.error(error.stack);
  }
};

/**
 * Log a trace message with stack trace
 */
export const logTrace = (message: string, options: LogOptions = {}): void => {
  const mergedOptions = { ...defaultOptions, ...options };
  console.log(formatLog(message, 'TRACE', mergedOptions));
  console.trace();
};

/**
 * Create a logger for a specific module
 */
export const createLogger = (module: string) => {
  const moduleOptions = { module };
  
  return {
    info: (message: string, data?: any) => logInfo(message, data, moduleOptions),
    debug: (message: string, data?: any) => logDebug(message, data, moduleOptions),
    warning: (message: string, data?: any) => logWarning(message, data, moduleOptions),
    error: (message: string, error?: any) => logError(message, error, moduleOptions),
    trace: (message: string) => logTrace(message, moduleOptions),
  };
};

// Default logger
export default {
  info: logInfo,
  debug: logDebug,
  warning: logWarning,
  error: logError,
  trace: logTrace,
  createLogger,
};