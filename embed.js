(function() {
  // Get script tag attributes
  const script = document.currentScript;
  const shopDomain = script.getAttribute('data-shop') || '';
  const productTitle = script.getAttribute('data-product-title') || '';
  const productImage = script.getAttribute('data-product-image') || '';
  const productPrice = script.getAttribute('data-product-price') || '0';
  const productQuantity = script.getAttribute('data-product-quantity') || '1';
  const currency = script.getAttribute('data-currency') || '$';
  const mode = script.getAttribute('data-mode') || 'inline'; // inline or popup
  
  // Create URL with product data
  const appUrl = script.src.split('/embed.js')[0];
  const checkoutUrl = new URL(appUrl);
  
  // Add product data as query parameters
  const params = new URLSearchParams();
  if (productTitle) params.append('title', productTitle);
  if (productImage) params.append('image', productImage);
  if (productPrice) params.append('price', productPrice);
  if (productQuantity) params.append('quantity', productQuantity);
  if (currency) params.append('currency', currency);
  if (shopDomain) params.append('shop', shopDomain);
  
  // Add UTM parameters if they exist
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  utmParams.forEach(param => {
    const value = new URLSearchParams(window.location.search).get(param);
    if (value) params.append(param, value);
  });
  
  // Create container element
  const container = document.getElementById('cod-checkout-app') || document.createElement('div');
  if (!container.id) {
    container.id = 'cod-checkout-app';
    document.body.appendChild(container);
  }
  
  // Handle inline mode
  if (mode === 'inline') {
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = `${appUrl}?${params.toString()}`;
    iframe.style.width = '100%';
    iframe.style.height = '800px';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('allow', 'payment');
    
    // Add iframe to container
    container.appendChild(iframe);
    
    // Adjust iframe height based on content
    window.addEventListener('message', function(event) {
      if (event.origin !== checkoutUrl.origin) return;
      
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'resize' && data.height) {
          iframe.style.height = `${data.height}px`;
        }
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    });
  }
  
  // Handle popup mode
  if (mode === 'popup') {
    // Create button
    const button = document.createElement('button');
    button.textContent = script.getAttribute('data-button-text') || 'Checkout Now';
    button.style.backgroundColor = script.getAttribute('data-button-color') || '#4A6CF7';
    button.style.color = script.getAttribute('data-button-text-color') || '#ffffff';
    button.style.padding = '12px 24px';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';
    button.style.fontWeight = '600';
    
    // Add button to container
    container.appendChild(button);
    
    // Create modal elements
    const modal = document.createElement('div');
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.zIndex = '9999';
    modal.style.overflow = 'auto';
    
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#ffffff';
    modalContent.style.margin = '5% auto';
    modalContent.style.padding = '0';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '600px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    modalContent.style.position = 'relative';
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.zIndex = '1';
    
    const iframe = document.createElement('iframe');
    iframe.src = `${appUrl}?${params.toString()}`;
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('allow', 'payment');
    
    // Assemble modal
    modalContent.appendChild(closeButton);
    modalContent.appendChild(iframe);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Open modal on button click
    button.addEventListener('click', function() {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Prevent scrolling
      
      // Send event to iframe that modal is open
      try {
        iframe.contentWindow.postMessage(JSON.stringify({ type: 'modalOpen' }), '*');
      } catch (e) {
        console.error('Error sending message to iframe:', e);
      }
    });
    
    // Close modal on close button click
    closeButton.addEventListener('click', function() {
      modal.style.display = 'none';
      document.body.style.overflow = ''; // Restore scrolling
    });
    
    // Close modal on outside click
    modal.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
      }
    });
    
    // Adjust iframe height based on content
    window.addEventListener('message', function(event) {
      if (event.origin !== checkoutUrl.origin) return;
      
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'resize' && data.height) {
          iframe.style.height = `${data.height}px`;
        }
        
        // Close modal on successful order
        if (data.type === 'orderComplete') {
          modal.style.display = 'none';
          document.body.style.overflow = ''; // Restore scrolling
          
          // Redirect if specified
          if (data.redirectUrl) {
            window.location.href = data.redirectUrl;
          }
        }
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    });
  }
})();