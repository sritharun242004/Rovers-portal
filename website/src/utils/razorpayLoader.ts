/**
 * Utility to load Razorpay checkout script
 */

interface RazorpayLoaderOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

/**
 * Loads the Razorpay checkout.js script if not already loaded
 * @param options - Configuration options for the loader
 * @returns Promise that resolves to a boolean indicating if loading was successful
 */
export const loadRazorpayScript = (options?: RazorpayLoaderOptions): Promise<boolean> => {
  return new Promise((resolve) => {
    // Environment check
    console.log('=== ENVIRONMENT CHECK ===');
    const hasRazorpayKey = !!import.meta.env.VITE_RAZORPAY_KEY_ID;
    console.log('VITE_RAZORPAY_KEY_ID available:', hasRazorpayKey);
    console.log('Using fallback Razorpay key:', !hasRazorpayKey);

    // Browser compatibility check
    console.log('=== BROWSER COMPATIBILITY CHECK ===');
    const userAgent = navigator.userAgent;
    console.log('User Agent:', userAgent);
    const browser = {
      chrome: /Chrome/.test(userAgent) && !/Edge/.test(userAgent),
      firefox: /Firefox/.test(userAgent),
      safari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
      edge: /Edge/.test(userAgent),
      ie: /MSIE|Trident/.test(userAgent)
    };
    console.log('Browser:', JSON.stringify(browser));

    console.log('=== ATTEMPTING TO LOAD RAZORPAY ===');
    // Check if Razorpay is already loaded
    const hasRazorpay = !!(window as any).Razorpay;
    console.log('Razorpay already in window:', hasRazorpay);

    if (hasRazorpay) {
      console.log('Razorpay already loaded, returning success');
      options?.onSuccess?.();
      resolve(true);
      return;
    }

    console.log('Razorpay not found in window, loading it');

    // Remove any existing Razorpay script elements to avoid duplicates
    const existingScripts = document.querySelectorAll('script[src*="checkout.razorpay.com"]');
    existingScripts.forEach(script => script.remove());

    // Remove any existing Razorpay iframe that might be causing interaction issues
    const existingIframe = document.querySelector('iframe[name="razorpay-checkout-frame"]');
    if (existingIframe) {
      console.log('Removing existing Razorpay iframe');
      existingIframe.remove();
    }

    if ((window as any).Razorpay) {
      console.log('Razorpay script already loaded');
      // Even if Razorpay object exists, we'll ensure a clean state
      delete (window as any).Razorpay;
      console.log('Reloading Razorpay script for a clean instance');
    }

    console.log('Creating script element for Razorpay');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.setAttribute('data-loaded', 'false');

    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      script.setAttribute('data-loaded', 'true');
      console.log('Razorpay now in window:', !!(window as any).Razorpay);

      // Add CSS to ensure the Razorpay modal is always on top
      const style = document.createElement('style');
      style.textContent = `
        iframe[name="razorpay-checkout-frame"] {
          z-index: 2147483647 !important;
          opacity: 1 !important;
          visibility: visible !important;
          position: fixed !important;
          pointer-events: auto !important;
        }
        .razorpay-backdrop {
          z-index: 2147483646 !important;
          opacity: 0.2 !important;
          visibility: visible !important;
          pointer-events: none !important;
        }
        .razorpay-payment-button {
          display: none !important;
        }
      `;
      document.head.appendChild(style);

      options?.onSuccess?.();
      console.log('Razorpay loading result: true');
      resolve(true);
    };

    script.onerror = (error) => {
      console.error('Failed to load Razorpay script', error);
      options?.onError?.(error);
      console.log('Razorpay loading result: false');
      resolve(false);
    };

    console.log('Script element added to body');
    document.body.appendChild(script);
  });
};

/**
 * Checks if the Razorpay script is already loaded
 * @returns boolean indicating if Razorpay is loaded
 */
export const isRazorpayLoaded = (): boolean => {
  return !!(window as any).Razorpay;
};

/**
 * Gets browser compatibility information for debugging
 * @returns Object with browser detection information
 */
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  return {
    userAgent,
    browsers: {
      chrome: /Chrome/.test(userAgent) && !/Edge/.test(userAgent),
      firefox: /Firefox/.test(userAgent),
      safari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
      edge: /Edge/.test(userAgent),
      ie: /MSIE|Trident/.test(userAgent),
      mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    }
  };
};

/**
 * Checks browser compatibility for Razorpay
 * @returns Object with compatibility check results
 */
export const checkBrowserCompatibility = () => {
  const userAgent = navigator.userAgent;
  const browserInfo = {
    userAgent,
    isChrome: /Chrome/.test(userAgent) && !/Edge/.test(userAgent),
    isFirefox: /Firefox/.test(userAgent),
    isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
    isEdge: /Edge/.test(userAgent),
    isIE: /MSIE|Trident/.test(userAgent),
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  };

  console.log('Browser compatibility check:', browserInfo);
  return browserInfo;
};

/**
 * Cleans up any existing Razorpay artifacts in the DOM
 * Useful to call before initiating a new payment
 */
export const cleanupRazorpayArtifacts = (): void => {
  try {
    console.log('Cleaning up Razorpay artifacts');

    // Remove any existing iframe
    const iframe = document.querySelector('iframe[name="razorpay-checkout-frame"]');
    if (iframe) {
      console.log('Removing Razorpay iframe');
      iframe.remove();
    }

    // Remove any backdrop
    const backdrop = document.querySelector('.razorpay-backdrop');
    if (backdrop) {
      console.log('Removing Razorpay backdrop');
      backdrop.remove();
    }

    // Remove any payment buttons
    const buttons = document.querySelectorAll('.razorpay-payment-button');
    if (buttons.length > 0) {
      console.log(`Removing ${buttons.length} Razorpay payment buttons`);
      buttons.forEach(button => button.remove());
    }

    console.log('Razorpay cleanup completed');
  } catch (error) {
    console.error('Error during Razorpay cleanup:', error);
  }
};

export const debugRazorpayDom = () => {
  console.log('=== DEBUGGING RAZORPAY DOM ===');

  // Check for existing Razorpay elements
  const existingFrame = document.querySelector('iframe[name="razorpay-checkout-frame"]');
  console.log('Existing Razorpay iframe:', existingFrame ? 'Found' : 'Not found');

  if (existingFrame) {
    console.log('Iframe style:', existingFrame.style.cssText);
    console.log('Iframe z-index:', getComputedStyle(existingFrame).zIndex);
    console.log('Iframe visible:', getComputedStyle(existingFrame).display !== 'none');
  }

  // Check for any elements above the iframe that might block it
  const highZIndexElements = Array.from(document.querySelectorAll('*'))
    .filter(el => {
      const zIndex = parseInt(getComputedStyle(el).zIndex);
      return !isNaN(zIndex) && zIndex > 9000;
    })
    .map(el => ({
      element: el.tagName,
      id: el.id,
      className: el.className,
      zIndex: getComputedStyle(el).zIndex
    }));

  console.log('High z-index elements that might block Razorpay:', highZIndexElements);

  // Check for event capturing that might interfere
  console.log('Body pointer-events:', getComputedStyle(document.body).pointerEvents);
  console.log('HTML pointer-events:', getComputedStyle(document.documentElement).pointerEvents);

  // Check for dialog elements that might be capturing events
  const activeDialogs = document.querySelectorAll('div[role="dialog"]');
  console.log('Active dialogs:', activeDialogs.length);

  activeDialogs.forEach((dialog, index) => {
    console.log(`Dialog ${index} styles:`, {
      position: getComputedStyle(dialog).position,
      zIndex: getComputedStyle(dialog).zIndex,
      pointerEvents: getComputedStyle(dialog).pointerEvents
    });
  });
  
  // Find and log overlay elements that might block Razorpay
  console.log('=== CHECKING FOR OVERLAY ELEMENTS ===');
  const overlays = document.querySelectorAll('[data-radix-popper-content-wrapper], [role="dialog"] + div, .fixed.inset-0.bg-black');
  console.log(`Found ${overlays.length} potential overlay elements`);
  
  overlays.forEach((overlay, index) => {
    if (overlay instanceof HTMLElement) {
      console.log(`Overlay ${index} details:`, {
        tagName: overlay.tagName,
        className: overlay.className,
        zIndex: getComputedStyle(overlay).zIndex,
        position: getComputedStyle(overlay).position,
        pointerEvents: getComputedStyle(overlay).pointerEvents,
        opacity: getComputedStyle(overlay).opacity
      });
    }
  });
}