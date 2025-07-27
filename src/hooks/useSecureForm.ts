import { useState, useCallback } from 'react';
import { rateLimiter, generateCSRFToken, setCSRFToken, getCSRFToken } from '@/lib/security';

interface UseSecureFormOptions {
  rateLimitKey: string;
  maxAttempts?: number;
  windowMs?: number;
}

export function useSecureForm(options: UseSecureFormOptions) {
  const [csrfToken, setCsrfTokenState] = useState<string>('');
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const initializeForm = useCallback(() => {
    // Generate and store CSRF token
    const token = generateCSRFToken();
    setCSRFToken(token);
    setCsrfTokenState(token);
  }, []);

  const validateSubmission = useCallback((): { isValid: boolean; error?: string } => {
    // Check rate limiting
    const isAllowed = rateLimiter.isAllowed(
      options.rateLimitKey,
      options.maxAttempts || 5,
      options.windowMs || 300000 // 5 minutes
    );

    if (!isAllowed) {
      const remaining = rateLimiter.getRemainingTime(
        options.rateLimitKey,
        options.windowMs || 300000
      );
      setIsRateLimited(true);
      setRemainingTime(Math.ceil(remaining / 1000 / 60)); // Convert to minutes
      return {
        isValid: false,
        error: `Muitas tentativas. Tente novamente em ${Math.ceil(remaining / 1000 / 60)} minutos.`
      };
    }

    // Validate CSRF token
    const currentToken = getCSRFToken();
    if (!currentToken || currentToken !== csrfToken) {
      return {
        isValid: false,
        error: 'Token de segurança inválido. Recarregue a página e tente novamente.'
      };
    }

    setIsRateLimited(false);
    setRemainingTime(0);
    return { isValid: true };
  }, [options.rateLimitKey, options.maxAttempts, options.windowMs, csrfToken]);

  const resetForm = useCallback(() => {
    initializeForm();
    setIsRateLimited(false);
    setRemainingTime(0);
  }, [initializeForm]);

  return {
    csrfToken,
    isRateLimited,
    remainingTime,
    initializeForm,
    validateSubmission,
    resetForm
  };
}