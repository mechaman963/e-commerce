import { useCallback } from 'react';
import { measureAsyncPerformance } from '@/utils/performance';

export const usePerformanceOptimization = (componentName: string) => {
  // Removed memory logging in development to improve performance

  // Memoized performance measurement wrapper
  const measureApiCall = useCallback(
    async <T>(apiCall: () => Promise<T>, operationName: string): Promise<T> => {
      return measureAsyncPerformance(
        `${componentName} - ${operationName}`,
        apiCall
      );
    },
    [componentName]
  );

  // Removed performance observer in development to improve compilation speed

  return {
    measureApiCall,
  };
};
