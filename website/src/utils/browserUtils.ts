/**
 * Browser utility functions to help with user agent detection and browser compatibility checks
 */

export type BrowserInfo = {
  chrome: boolean;
  firefox: boolean;
  safari: boolean;
  edge: boolean;
  ie: boolean;
  mobile: boolean;
  os: string;
  userAgent: string;
};

/**
 * Detects the browser and OS information from the user agent
 * @returns Browser and OS information
 */
export const detectBrowser = (): BrowserInfo => {
  const userAgent = navigator.userAgent;
  
  return {
    chrome: /chrome|chromium/i.test(userAgent) && !/edg/i.test(userAgent),
    firefox: /firefox/i.test(userAgent),
    safari: /safari/i.test(userAgent) && !/chrome|chromium/i.test(userAgent),
    edge: /edg/i.test(userAgent),
    ie: /msie|trident/i.test(userAgent),
    mobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),
    os: detectOS(userAgent),
    userAgent: userAgent
  };
};

/**
 * Detects the operating system from the user agent
 * @param userAgent - The user agent string
 * @returns The detected operating system
 */
const detectOS = (userAgent: string): string => {
  if (/android/i.test(userAgent)) return 'Android';
  if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS';
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/mac/i.test(userAgent)) return 'MacOS';
  if (/linux/i.test(userAgent)) return 'Linux';
  if (/unix/i.test(userAgent)) return 'Unix';
  return 'Unknown';
};

/**
 * Logs browser compatibility information to the console
 * Useful for debugging issues related to browser compatibility
 */
export const logBrowserInfo = (): void => {

  const browserInfo = detectBrowser();
  console.log('User Agent:', browserInfo.userAgent);
  console.log('Browser:', {
    chrome: browserInfo.chrome,
    firefox: browserInfo.firefox,
    safari: browserInfo.safari,
    edge: browserInfo.edge,
    ie: browserInfo.ie
  });
  console.log('Mobile Device:', browserInfo.mobile);
  console.log('Operating System:', browserInfo.os);
};

/**
 * Checks if a script is already loaded in the document
 * @param src - The script source URL to check
 * @returns True if the script is already loaded, false otherwise
 */
export const isScriptLoaded = (src: string): boolean => {
  return document.querySelector(`script[src="${src}"]`) !== null;
};

/**
 * Loads a script dynamically and returns a promise
 * @param src - The script source URL
 * @param id - Optional ID for the script element
 * @returns Promise that resolves when the script is loaded or rejects on error
 */
export const loadScript = (src: string, id?: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (isScriptLoaded(src)) {
      console.log(`Script already loaded: ${src}`);
      resolve(true);
      return;
    }
    
    console.log(`Loading script: ${src}`);
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    if (id) {
      script.id = id;
    }
    
    script.onload = () => {
      console.log(`Script loaded successfully: ${src}`);
      resolve(true);
    };
    
    script.onerror = (error) => {
      console.error(`Failed to load script: ${src}`, error);
      reject(new Error(`Failed to load script: ${src}`));
    };
    
    document.body.appendChild(script);
    console.log(`Script element added to body: ${src}`);
  });
};