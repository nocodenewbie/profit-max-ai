
(function() {
  'use strict';
  
  // Configuration
  const WIDGET_API_BASE = 'https://blkgutzpmwmjuadznwwp.functions.supabase.co/functions/v1';
  let widgetId = null;
  let distributorId = null;
  let companyName = null;
  let isOpen = false;
  let messages = [];
  
  // Extract configuration from script tag
  function getConfig() {
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];
      if (script.src && script.src.includes('widget.js')) {
        widgetId = script.getAttribute('data-widget-id');
        distributorId = script.getAttribute('data-distributor-id');
        companyName = script.getAttribute('data-company') || 'Nossa Empresa';
        break;
      }
    }
  }
  
  // Create widget styles
  function createStyles() {
    const styles = `
      .vvi-widget-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .vvi-widget-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        color: white;
      }
      
      .vvi-widget-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 25px rgba(0,0,0,0.3);
      }
      
      .vvi-widget-chat {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        display: none;
        flex-direction: column;
        overflow: hidden;
      }
      
      .vvi-widget-chat.open {
        display: flex;
        animation: slideUp 0.3s ease;
      }
      
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .vvi-widget-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .vvi-widget-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 20px;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .vvi-widget-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        background: #f8f9fa;
      }
      
      .vvi-message {
        margin-bottom: 12px;
        max-width: 80%;
      }
      
      .vvi-message.user {
        margin-left: auto;
      }
      
      .vvi-message-content {
        padding: 8px 12px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.4;
      }
      
      .vvi-message.bot .vvi-message-content {
        background: white;
        border: 1px solid #e5e7eb;
      }
      
      .vvi-message.user .vvi-message-content {
        background: #667eea;
        color: white;
        margin-left: auto;
      }
      
      .vvi-widget-input {
        border-top: 1px solid #e5e7eb;
        padding: 16px;
        display: flex;
        gap: 8px;
      }
      
      .vvi-widget-input input {
        flex: 1;
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        padding: 8px 16px;
        font-size: 14px;
        outline: none;
      }
      
      .vvi-widget-input input:focus {
        border-color: #667eea;
      }
      
      .vvi-widget-send {
        background: #667eea;
        color: white;
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .vvi-widget-simulate {
        background: transparent;
        border: none;
        color: #667eea;
        font-size: 12px;
        cursor: pointer;
        padding: 0 4px;
      }
      
      .vvi-typing {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #6b7280;
        font-size: 12px;
        margin-top: 8px;
      }
      
      .vvi-typing-dots {
        display: flex;
        gap: 2px;
      }
      
      .vvi-typing-dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #6b7280;
        animation: typing 1.4s infinite;
      }
      
      .vvi-typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .vvi-typing-dot:nth-child(3) { animation-delay: 0.4s; }
      
      @keyframes typing {
        0%, 60%, 100% { opacity: 0.3; }
        30% { opacity: 1; }
      }
      
      @media (max-width: 480px) {
        .vvi-widget-chat {
          width: 100vw;
          height: 100vh;
          bottom: 0;
          right: 0;
          border-radius: 0;
        }
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }
  
  // Create widget HTML
  function createWidget() {
    const container = document.createElement('div');
    container.className = 'vvi-widget-container';
    container.innerHTML = `
      <button class="vvi-widget-button" onclick="window.vviWidget.toggle()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      </button>
      
      <div class="vvi-widget-chat" id="vvi-chat">
        <div class="vvi-widget-header">
          <div>
            <div style="font-weight: 600;">${companyName}</div>
            <div style="font-size: 12px; opacity: 0.9;">Vendedor Virtual</div>
          </div>
          <button class="vvi-widget-close" onclick="window.vviWidget.close()">×</button>
        </div>
        
        <div class="vvi-widget-messages" id="vvi-messages">
          <div class="vvi-message bot">
            <div class="vvi-message-content">
              Olá! Sou o assistente virtual da ${companyName}. Como posso ajudá-lo hoje?
            </div>
          </div>
        </div>
        
        <div class="vvi-widget-input">
          <button class="vvi-widget-simulate" onclick="window.vviWidget.simulateQuote()" title="Simular cotação">Simular</button>
          <input type="text" id="vvi-input" placeholder="Digite sua mensagem..." onkeypress="window.vviWidget.handleKeyPress(event)">
          <button class="vvi-widget-send" onclick="window.vviWidget.sendMessage()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(container);
  }
  
  // API functions
  async function sendToAPI(message) {
    try {
      const response = await fetch(`${WIDGET_API_BASE}/widget-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          distributorId: distributorId,
          message: message,
          conversationId: localStorage.getItem('vvi-conversation-id')
        })
      });
      
      const data = await response.json();
      
      if (data.conversationId) {
        localStorage.setItem('vvi-conversation-id', data.conversationId);
      }
      
      if (!data.success) {
        return 'Desculpe, ocorreu um erro. Tente novamente em alguns momentos.';
      }
      
      return data.message;
    } catch (error) {
      console.error('Widget API error:', error);
      return 'Desculpe, ocorreu um erro. Tente novamente em alguns momentos.';
    }
  }
  
  // Widget functionality
  window.vviWidget = {
    toggle() {
      const chat = document.getElementById('vvi-chat');
      isOpen = !isOpen;
      chat.classList.toggle('open', isOpen);
      
      if (isOpen) {
        document.getElementById('vvi-input').focus();
      }
    },
    
    close() {
      const chat = document.getElementById('vvi-chat');
      isOpen = false;
      chat.classList.remove('open');
    },
    
    async sendMessage() {
      const input = document.getElementById('vvi-input');
      const message = input.value.trim();
      
      if (!message) return;
      
      // Add user message
      this.addMessage(message, 'user');
      input.value = '';
      
      // Show typing indicator
      this.showTyping();
      
      // Send to API and get response
      const response = await sendToAPI(message);
      
      // Hide typing and add bot response
      this.hideTyping();
      this.addMessage(response, 'bot');
    },
    
    async simulateQuote() {
      // User-visible action in chat
      this.addMessage('Simular cotação', 'user');
      this.showTyping();
      try {
        const response = await fetch(`${WIDGET_API_BASE}/widget-chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            distributorId: distributorId,
            action: 'simulate_quote',
            conversationId: localStorage.getItem('vvi-conversation-id')
          })
        });
        const data = await response.json();
        if (data.conversationId) {
          localStorage.setItem('vvi-conversation-id', data.conversationId);
        }
        this.hideTyping();
        if (data.success) {
          this.addMessage(data.message || 'Cotação simulada com sucesso.', 'bot');
        } else {
          this.addMessage('Não foi possível simular a cotação agora.', 'bot');
        }
      } catch (e) {
        console.error('simulateQuote error:', e);
        this.hideTyping();
        this.addMessage('Erro ao simular a cotação. Tente novamente.', 'bot');
      }
    },
    
    addMessage(content, sender) {
      const messagesContainer = document.getElementById('vvi-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = `vvi-message ${sender}`;
      messageDiv.innerHTML = `<div class="vvi-message-content">${content}</div>`;
      
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },
    
    showTyping() {
      const messagesContainer = document.getElementById('vvi-messages');
      const typingDiv = document.createElement('div');
      typingDiv.className = 'vvi-typing';
      typingDiv.id = 'vvi-typing';
      typingDiv.innerHTML = `
        Digitando
        <div class="vvi-typing-dots">
          <div class="vvi-typing-dot"></div>
          <div class="vvi-typing-dot"></div>
          <div class="vvi-typing-dot"></div>
        </div>
      `;
      
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },
    
    hideTyping() {
      const typing = document.getElementById('vvi-typing');
      if (typing) {
        typing.remove();
      }
    },
    
    handleKeyPress(event) {
      if (event.key === 'Enter') {
        this.sendMessage();
      }
    }
  };
  
  // Initialize widget
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    getConfig();
    
    if (!distributorId) {
      console.error('VVI Widget: data-distributor-id não encontrado');
      return;
    }
    
    createStyles();
    createWidget();
  }
  
  init();
})();
