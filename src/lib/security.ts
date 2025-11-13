import DOMPurify from 'dompurify';

// Input sanitization and validation utilities
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  return DOMPurify.sanitize(input.trim());
};

// Sanitize plain text (allows spaces and common business characters)
export const sanitizePlainText = (input: string): string => {
  if (typeof input !== 'string') return '';
  // Remove only dangerous characters while keeping spaces and common business chars
  return input
    .trim()
    .replace(/[<>\/\\]/g, '') // Remove dangerous HTML/path characters
    .replace(/javascript:/gi, '') // Remove script injection
    .replace(/data:/gi, ''); // Remove data URIs
};

export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  });
};

// Email validation with security considerations
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email é obrigatório' };
  }

  const trimmedEmail = email.trim().toLowerCase();
  
  // Check length constraints
  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email muito longo' };
  }

  if (trimmedEmail.length < 5) {
    return { isValid: false, error: 'Email muito curto' };
  }

  // Comprehensive email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Formato de email inválido' };
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\.\./,           // Double dots
    /\s/,             // Whitespace
    /[<>]/,           // Angle brackets
    /javascript:/i,   // Script injection
    /data:/i,         // Data URIs
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(trimmedEmail)) {
      return { isValid: false, error: 'Email contém caracteres inválidos' };
    }
  }

  return { isValid: true };
};

// Strong password validation
export const validatePassword = (password: string): { isValid: boolean; error?: string; strength: number } => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Senha é obrigatória', strength: 0 };
  }

  let strength = 0;
  const errors = [];

  // Length check
  if (password.length < 8) {
    errors.push('pelo menos 8 caracteres');
  } else if (password.length >= 12) {
    strength += 2;
  } else {
    strength += 1;
  }

  // Character type checks
  if (!/[a-z]/.test(password)) {
    errors.push('pelo menos uma letra minúscula');
  } else {
    strength += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('pelo menos uma letra maiúscula');
  } else {
    strength += 1;
  }

  if (!/\d/.test(password)) {
    errors.push('pelo menos um número');
  } else {
    strength += 1;
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('pelo menos um caractere especial');
  } else {
    strength += 1;
  }

  // Common patterns to avoid
  const weakPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /abc123/i,
    /(.)\1{3,}/,  // Repeated characters
  ];

  for (const pattern of weakPatterns) {
    if (pattern.test(password)) {
      errors.push('não pode conter padrões comuns');
      strength = Math.max(0, strength - 2);
      break;
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      error: `A senha deve ter: ${errors.join(', ')}`,
      strength: Math.max(0, strength)
    };
  }

  return { isValid: true, strength };
};

// Full name validation
export const validateFullName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Nome é obrigatório' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
  }

  if (trimmedName.length > 100) {
    return { isValid: false, error: 'Nome muito longo (máximo 100 caracteres)' };
  }

  // Only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, error: 'Nome contém caracteres inválidos' };
  }

  return { isValid: true };
};

// Company name validation (allows spaces and business characters)
export const validateCompanyName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Nome da empresa é obrigatório' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
  }

  if (trimmedName.length > 100) {
    return { isValid: false, error: 'Nome muito longo (máximo 100 caracteres)' };
  }

  // Allow letters, numbers, spaces, and common business characters (&, -, ., etc.)
  const companyRegex = /^[a-zA-Z0-9À-ÿ\s&.,'\-()]+$/;
  if (!companyRegex.test(trimmedName)) {
    return { isValid: false, error: 'Nome contém caracteres inválidos' };
  }

  // Check for suspicious content
  const suspiciousPatterns = [
    /<[^>]*>/,        // HTML tags
    /javascript:/i,   // Script injection
    /data:/i,         // Data URIs
    /[<>]/,           // Angle brackets
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(trimmedName)) {
      return { isValid: false, error: 'Nome contém caracteres inválidos' };
    }
  }

  return { isValid: true };
};

// Rate limiting for client-side protection
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 300000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Clean old attempts
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false;
    }

    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }

  getRemainingTime(key: string, windowMs: number = 300000): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const remainingTime = Math.max(0, windowMs - (Date.now() - oldestAttempt));
    return remainingTime;
  }
}

export const rateLimiter = new RateLimiter();

// CSRF token management
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const setCSRFToken = (token: string): void => {
  sessionStorage.setItem('csrf_token', token);
};

export const getCSRFToken = (): string | null => {
  return sessionStorage.getItem('csrf_token');
};

export const validateCSRFToken = (token: string): boolean => {
  const storedToken = getCSRFToken();
  return storedToken !== null && storedToken === token;
};

// Generic error messages to prevent information disclosure
export const getGenericErrorMessage = (error: any): string => {
  // Log the actual error for debugging (in production, this should go to a secure logging service)
  console.error('Security Error:', error);

  // Common Supabase auth errors with generic messages
  const errorMessages: Record<string, string> = {
    'Invalid login credentials': 'Credenciais inválidas. Verifique seu email e senha.',
    'Email not confirmed': 'Por favor, confirme seu email antes de fazer login.',
    'Too many requests': 'Muitas tentativas. Tente novamente em alguns minutos.',
    'User already registered': 'Este email já está cadastrado. Tente fazer login.',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
    'Invalid email': 'Formato de email inválido.',
    'Network error': 'Erro de conexão. Verifique sua internet e tente novamente.',
  };

  const errorMessage = error?.message || '';
  
  // Return specific message if it's a known safe error
  for (const [key, value] of Object.entries(errorMessages)) {
    if (errorMessage.includes(key)) {
      return value;
    }
  }

  // Default generic message for unknown errors
  return 'Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.';
};