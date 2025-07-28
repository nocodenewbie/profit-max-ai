import { useEffect } from 'react';

export function SecurityHeaders() {
  useEffect(() => {
    // Set security headers via meta tags
    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const setHttpEquivTag = (httpEquiv: string, content: string) => {
      let meta = document.querySelector(`meta[http-equiv="${httpEquiv}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.httpEquiv = httpEquiv;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Content Security Policy - Enhanced security without unsafe directives
    setHttpEquivTag('Content-Security-Policy', 
      "default-src 'self' https://blkgutzpmwmjuadznwwp.supabase.co; " +
      "script-src 'self' https://blkgutzpmwmjuadznwwp.supabase.co; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' https:; " +
      "connect-src 'self' https://blkgutzpmwmjuadznwwp.supabase.co https://api.openai.com; " +
      "frame-ancestors 'none'; " +
      "object-src 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self';"
    );

    // X-Frame-Options
    setHttpEquivTag('X-Frame-Options', 'DENY');

    // X-Content-Type-Options
    setHttpEquivTag('X-Content-Type-Options', 'nosniff');

    // Referrer Policy
    setMetaTag('referrer', 'strict-origin-when-cross-origin');

    // Permissions Policy
    setHttpEquivTag('Permissions-Policy', 
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), autoplay=()'
    );

    // Cross-Origin policies
    setHttpEquivTag('Cross-Origin-Embedder-Policy', 'unsafe-none');
    setHttpEquivTag('Cross-Origin-Opener-Policy', 'same-origin');
    setHttpEquivTag('Cross-Origin-Resource-Policy', 'same-origin');
  }, []);

  return null;
}

export default SecurityHeaders;