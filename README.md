# Cash on Delivery Checkout App

A complete, production-ready Cash on Delivery Checkout App that works with Shopify and replicates all the features of top-tier apps like EasySell — including Upsells, Multilingual Support, Admin Panel, Tracking Pixels, and Google Sheets/Firebase integrations.

## Features

### Shopify Integration
- Embed checkout form on Shopify product/cart/landing pages
- Accept product data via URL parameters (title, image, price, quantity)
- Responsive popup or standalone page
- Auto-detect Shopify store theme color to style form

### Multilingual + RTL Support
- Full support for Arabic (RTL), French, and English
- Auto language detection from browser
- Manual language switcher
- All labels and text fully translatable via i18n

### Checkout Form Features
- Fields:
  - Full Name (required)
  - Phone Number (with auto country code + validation)
  - Address, City (with suggestions), ZIP code (optional)
  - Optional Notes (toggleable)
  - Product info (image, title, price, quantity, total)
- Sticky CTA: "Order Now" button
- Countdown timer (optional)
- Trust seals and COD icons
- Disable copy/paste on sensitive fields
- Support for UTM tracking (utm_source, campaign…)

### Upsell + Quantity Offers
- Pre-purchase upsell product (optional)
- Post-purchase 1-click upsell on Thank You Page
- Quantity offers (e.g. Buy 2, Get 10% off)
- Admin toggle to enable/disable, set upsell items and offers

### Thank You Page
- Display order summary + message
- Show recommended product (upsell)
- Redirect timer to homepage or WhatsApp
- Copy order summary or share on social
- Include conversion tracking events

### Tracking Pixels (Meta, TikTok, Google, Snapchat)
- Admin setting to paste Pixel IDs
- Inject dynamically into Head or Body
- Fire events: Page view, Order submitted, Button click
- Enable/disable individual pixels

### Admin Dashboard
- Secure login (email/password or admin PIN)
- Stats Dashboard: Total orders, orders today, top cities/products, abandoned vs confirmed
- Orders Table: Name, Phone, Product, Qty, Price, City, UTM, Timestamp
- Sort, Filter, Search, Export to CSV, Delete/restore
- Manual status change: New, Confirmed, Delivered, Canceled
- Add admin notes

### Settings Panel
- Toggle: Notes, ZIP, phone validation, city dropdown, WhatsApp redirect, countdown timer, test mode, UTM tracking, manual approval mode
- Add/Remove fields
- Input: Currency, default shipping cost, Firebase config, Google Sheets webhook, custom redirect URL

### Design Customizer
- Customize: Font family, size, weight, field styles, button color, text, size, background color, form width, label visibility, alignment
- Configurable via config file or Admin visual editor
- Optional dark mode toggle

### Google Sheets Integration
- Send each order to Google Sheets (via webhook/API)
- Include UTM, timestamp, and upsell data
- Retry mechanism on failure (optional)

### Firebase Integration
- Store orders in Firestore/Realtime Database
- Separate test/live environments
- External firebase.js config file
- Admin dashboard uses Firebase for real-time data

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Google account (for Google Sheets integration)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/cod-checkout-app.git
cd cod-checkout-app
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a `.env` file based on `.env.example` and fill in your configuration

```bash
cp .env.example .env
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

## Deploying on Vercel

1. Create a Vercel account if you don't have one at [vercel.com](https://vercel.com)

2. Install the Vercel CLI

```bash
npm install -g vercel
```

3. Login to Vercel

```bash
vercel login
```

4. Deploy your app

```bash
vercel
```

5. For production deployment

```bash
vercel --prod
```

Alternatively, you can connect your GitHub repository to Vercel for automatic deployments.

## Configuring Firebase

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)

2. Enable Authentication and Firestore/Realtime Database

3. Create a web app in your Firebase project

4. Copy the Firebase configuration to your `.env` file or directly to the admin settings panel

```javascript
// Example Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

5. Set up Firebase Authentication with Email/Password provider

6. Create an admin user through the Firebase console or using Firebase Admin SDK

## Configuring Google Sheets Integration

1. Create a new Google Sheet

2. Go to Extensions > Apps Script

3. Replace the code with the following:

```javascript
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Check if headers exist, if not add them
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Order ID', 'Date', 'Customer Name', 'Phone', 'Address', 'City', 'ZIP', 'Notes',
        'Product', 'Quantity', 'Price', 'Shipping', 'Total', 'Status',
        'UTM Source', 'UTM Medium', 'UTM Campaign', 'UTM Content', 'UTM Term',
        'Upsells', 'Admin Notes'
      ]);
    }
    
    // Format the data for the sheet
    const rowData = [
      data.orderId,
      new Date(data.timestamp),
      data.customer.name,
      data.customer.phone,
      data.customer.address,
      data.customer.city,
      data.customer.zip || '',
      data.customer.notes || '',
      data.products.map(p => p.title).join(', '),
      data.products.map(p => p.quantity).join(', '),
      data.subtotal,
      data.shipping,
      data.total,
      data.status,
      data.utm?.source || '',
      data.utm?.medium || '',
      data.utm?.campaign || '',
      data.utm?.content || '',
      data.utm?.term || '',
      data.upsells?.map(u => `${u.title} (${u.price})`).join(', ') || '',
      data.adminNotes || ''
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Order added to Google Sheets'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Deploy the script as a web app:
   - Click on Deploy > New deployment
   - Select type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Click Deploy

5. Copy the web app URL and paste it in your `.env` file or directly in the admin settings panel

## Embedding in Shopify

### Method 1: Using Script Tag

1. Go to your Shopify admin > Online Store > Themes

2. Edit the theme code

3. Find the appropriate template file (e.g., `product.liquid` or `cart.liquid`)

4. Add the following code where you want the checkout form to appear:

```html
<div id="cod-checkout-app"></div>
<script src="https://your-vercel-app.vercel.app/embed.js" 
  data-shop="{{ shop.permanent_domain }}"
  data-product-title="{{ product.title }}"
  data-product-image="{{ product.featured_image | img_url: 'medium' }}"
  data-product-price="{{ product.price | money_without_currency }}"
  data-currency="{{ shop.currency }}"
></script>
```

### Method 2: Using Shopify App Embed

1. Create a Shopify app in the Shopify Partner Dashboard

2. Set up App Bridge and get your API credentials

3. Configure your app to request the necessary scopes

4. Use the Shopify App Bridge to embed your app in the Shopify admin

## Customizing Design

1. Log in to the admin panel

2. Navigate to the Design tab

3. Customize the following:
   - Typography: Font family, size, weight, label visibility
   - Colors: Primary color, background color, button text color
   - Layout: Form width, border radius, input padding
   - Theme: Enable dark mode, auto-detect theme, detect Shopify theme

4. Preview your changes in real-time

5. Save your changes

## Switching Languages

1. The app automatically detects the user's browser language

2. Users can manually switch languages using the language selector

3. To add or modify translations:
   - Navigate to `src/i18n/locales`
   - Edit the JSON files for each language
   - Add new language files as needed
   - Update the language options in `src/i18n/index.js`

## Setting Up Tracking Pixels

1. Log in to the admin panel

2. Navigate to the Settings tab > Pixels

3. Enter your pixel IDs for:
   - Meta (Facebook) Pixel
   - Google Analytics
   - TikTok Pixel
   - Snapchat Pixel

4. Enable or disable each pixel as needed

5. The pixels will be automatically injected into the page and will track:
   - Page views
   - Button clicks
   - Order submissions

## Managing Upsells and Settings

1. Log in to the admin panel

2. Navigate to the Settings tab > Upsell

3. Enable upsells

4. Configure pre-purchase upsell:
   - Product title
   - Description
   - Price
   - Image URL

5. Configure post-purchase upsell:
   - Product title
   - Description
   - Price
   - Image URL

6. Enable quantity offers (optional):
   - Set offer quantity (e.g., 2)
   - Set offer discount percentage (e.g., 10%)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact [your-email@example.com](mailto:your-email@example.com).