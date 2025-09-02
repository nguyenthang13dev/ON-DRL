import { useState, useCallback } from 'react';

export interface LoadingState {
  [key: string]: boolean;
}

export const useLoading = (initialState: LoadingState = {}) => {
  const [loading, setLoading] = useState<LoadingState>(initialState);

  const setLoadingState = useCallback((key: string, isLoading: boolean) => {
    setLoading(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  const setMultipleLoadingStates = useCallback((states: LoadingState) => {
    setLoading(prev => ({
      ...prev,
      ...states
    }));
  }, []);

  const startLoading = useCallback((key: string) => {
    setLoadingState(key, true);
  }, [setLoadingState]);

  const stopLoading = useCallback((key: string) => {
    setLoadingState(key, false);
  }, [setLoadingState]);

  const isLoading = useCallback((key: string): boolean => {
    return loading[key] || false;
  }, [loading]);

  const isAnyLoading = useCallback((): boolean => {
    return Object.values(loading).some(state => state);
  }, [loading]);

  const resetLoading = useCallback(() => {
    setLoading({});
  }, []);

  // Wrapper function cho async operations với loading
  const withLoading = useCallback(
    async <T>(key: string, asyncFn: () => Promise<T>): Promise<T> => {
      try {
        startLoading(key);
        const result = await asyncFn();
        return result;
      } finally {
        stopLoading(key);
      }
    },
    [startLoading, stopLoading]
  );

  return {
    loading,
    setLoadingState,
    setMultipleLoadingStates,
    startLoading,
    stopLoading,
    isLoading,
    isAnyLoading,
    resetLoading,
    withLoading
  };
};

export default useLoading;
