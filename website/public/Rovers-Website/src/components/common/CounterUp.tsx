import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface CounterUpProps {
  value: string | number;
  duration?: number;
  suffix?: string;
  className?: string;
  delay?: number;
}

export const CounterUp: React.FC<CounterUpProps> = ({ 
  value, 
  duration = 2, 
  suffix = '', 
  className = '',
  delay = 0
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Extract numeric value from string (e.g., "15,000+" -> 15000)
  const getNumericValue = (val: string | number): number => {
    if (typeof val === 'number') return val;
    
    // Remove common suffixes and formatting
    const cleanValue = val.toString()
      .replace(/[+,\s]/g, '')
      .replace(/k/i, '000')
      .replace(/m/i, '000000');
    
    const numericValue = parseFloat(cleanValue);
    return isNaN(numericValue) ? 0 : numericValue;
  };

  // Format the display value
  const formatValue = (currentCount: number, originalValue: string | number): string => {
    const originalStr = originalValue.toString();
    
    // Check if original had 'k' suffix
    if (originalStr.toLowerCase().includes('k')) {
      const displayValue = Math.round(currentCount / 1000);
      return `${displayValue}k`;
    }
    
    // Check if original had 'm' suffix
    if (originalStr.toLowerCase().includes('m')) {
      const displayValue = Math.round(currentCount / 1000000);
      return `${displayValue}m`;
    }
    
    // Check if original had commas
    if (originalStr.includes(',')) {
      return currentCount.toLocaleString();
    }
    
    return Math.round(currentCount).toString();
  };

  const targetValue = getNumericValue(value);

  useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.round(easeOutQuart * targetValue);
        
        setCount(currentCount);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [isInView, targetValue, duration, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {formatValue(count, value)}{suffix}
    </motion.div>
  );
};
