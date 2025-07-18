
import { handleWidgetChat } from '@/api/widget';

// This component handles API requests for the widget
// In a real deployment, this would be a proper API endpoint
export const WidgetAPI = {
  async handleRequest(request: any) {
    const { pathname, method, body } = request;
    
    if (pathname === '/api/widget/chat' && method === 'POST') {
      return await handleWidgetChat(body);
    }
    
    return {
      success: false,
      error: 'Endpoint não encontrado'
    };
  }
};

// For development, we'll add a global handler
if (typeof window !== 'undefined') {
  // Override fetch for widget API calls
  const originalFetch = window.fetch;
  window.fetch = async function(url: any, options: any = {}) {
    if (typeof url === 'string' && url.includes('/api/widget/')) {
      try {
        const body = options.body ? JSON.parse(options.body) : null;
        const result = await WidgetAPI.handleRequest({
          pathname: new URL(url, window.location.origin).pathname,
          method: options.method || 'GET',
          body
        });
        
        return {
          ok: true,
          json: async () => result,
          status: 200,
          statusText: 'OK'
        } as Response;
      } catch (error) {
        return {
          ok: false,
          json: async () => ({ success: false, error: 'Internal server error' }),
          status: 500,
          statusText: 'Internal Server Error'
        } as Response;
      }
    }
    
    return originalFetch.call(this, url, options);
  };
}
