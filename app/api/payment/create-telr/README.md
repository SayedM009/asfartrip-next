# Telr Payment Gateway Integration

## Overview
Created a universal Telr payment gateway route that can be used for all services (Flight, Hotel, etc.).

## API Endpoint
```
POST /api/payment/create-telr
```

## Request Body
```json
{
  "amount": "800",
  "currency": "AED",
  "merchant_order_id": "AFT11F2120Z136236",
  "description": "Flight booking - AFT11F2120Z136236",
  "module": "FLIGHT",
  "return_url": "https://example.com/payment/callback/AFT11F2120Z136236?gateway=telr&module=FLIGHT",
  "cancelled_url": "http://localhost:3000/en/payment/checkstatus/VS84B7X21Q01103132685",
  "declined_url": "http://localhost:3000/en/payment/checkstatus/VS84B7X21Q01103132685",
  "framed": "3"
}
```

### Required Fields
- `amount`: Payment amount
- `currency`: Currency code (e.g., "AED", "USD")
- `merchant_order_id`: Unique order identifier
- `description`: Payment description
- `module`: Service module ("FLIGHT", "HOTEL", etc.)
- `return_url`: Success callback URL

### Optional Fields
- `cancelled_url`: Cancellation callback URL (defaults to return_url)
- `declined_url`: Decline callback URL (defaults to return_url)
- `framed`: Display mode (default: "3" for iframe)

## Response

### Success Response
```json
{
  "success": true,
  "data": {
    // Telr API response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": {}
}
```

## Usage Example

### From Client Component
```javascript
async function createPayment(bookingData) {
  try {
    const response = await fetch('/api/payment/create-telr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: bookingData.totalPrice,
        currency: 'AED',
        merchant_order_id: bookingData.orderId,
        description: `Flight booking - ${bookingData.orderId}`,
        module: 'FLIGHT',
        return_url: `${window.location.origin}/payment/callback/${bookingData.orderId}?gateway=telr&module=FLIGHT`,
        cancelled_url: `${window.location.origin}/en/payment/checkstatus/${bookingData.orderId}`,
        declined_url: `${window.location.origin}/en/payment/checkstatus/${bookingData.orderId}`,
      }),
    });

    const result = await response.json();

    if (result.success) {
      // Redirect to payment page or handle payment URL
      console.log('Payment created:', result.data);
    } else {
      console.error('Payment creation failed:', result.error);
    }
  } catch (error) {
    console.error('Error creating payment:', error);
  }
}
```

### For Different Modules

#### Flight Booking
```javascript
{
  "module": "FLIGHT",
  "description": "Flight booking - AFT11F2120Z136236"
}
```

#### Hotel Booking
```javascript
{
  "module": "HOTEL",
  "description": "Hotel booking - HTL11F2120Z136236"
}
```

## Features
 Universal route for all service modules
 Automatic token management and authentication
 Comprehensive error handling
 Field validation
 Flexible callback URLs
 Support for iframe mode

## Implementation Details

### Authentication
The route automatically handles authentication using the `getValidToken()` function from `token-manager.js`, which:
- Retrieves existing valid tokens
- Refreshes expired tokens
- Handles token lifecycle

### Error Handling
- Validates all required fields
- Returns appropriate HTTP status codes
- Provides detailed error messages
- Logs errors for debugging

### Security
- Uses environment variables for sensitive data
- Server-side token management
- Secure API communication
