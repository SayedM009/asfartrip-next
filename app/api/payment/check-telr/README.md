# Telr Payment Check API

## Endpoint
```
POST /api/payment/check-telr
```

## Description
Checks the status of a Telr payment transaction using the order reference.

## Request Body

### Required Fields
- `order_ref` (string) - The Telr order reference returned from create-telr

### Example Request
```json
{
  "order_ref": "A9896DDE87F06A875FAE454D2676379F246D089288743E4FBFDE11C8B48FAE1E"
}
```

## Response

### Success Response (200)
```json
{
  "success": true,
  "data": {
    // Telr check response data
    "status": "paid",
    "amount": "800",
    "currency": "AED",
    "merchant_order_id": "AFT11F2120Z136236",
    // ... other Telr response fields
  }
}
```

### Error Responses

#### Missing order_ref (400)
```json
{
  "success": false,
  "error": "Missing required field: order_ref"
}
```

#### Authentication Error (401)
```json
{
  "success": false,
  "error": "Failed to get authentication token"
}
```

#### Telr API Error (varies)
```json
{
  "success": false,
  "error": "Telr API error: 404"
}
```

#### Internal Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Usage Example

### Client-side
```javascript
async function checkTelrPayment(orderRef) {
    try {
        const response = await fetch('/api/payment/check-telr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order_ref: orderRef,
            }),
        });

        const result = await response.json();

        if (result.success) {
            console.log('Payment status:', result.data);
            return result.data;
        } else {
            console.error('Check failed:', result.error);
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error checking payment:', error);
        throw error;
    }
}

// Usage
const orderRef = "A9896DDE87F06A875FAE454D2676379F246D089288743E4FBFDE11C8B48FAE1E";
const paymentStatus = await checkTelrPayment(orderRef);
```

## Implementation Details

### Authentication
- Uses `getValidToken()` from `@/app/_libs/token-manager`
- Automatically manages API token lifecycle
- Token is included in the request to Telr API

### Telr API Call
```javascript
POST ${NEXT_PUBLIC_API_BASE_URL}/api/telr/check

Body:
{
  "api_token": "DLJ98A8HCYKOQSV2ETQHJQ0XLM01M1UI49B2DL5MSTTAQVL88BS7TBRFTBAJ2002",
  "order_ref": "A9896DDE87F06A875FAE454D2676379F246D089288743E4FBFDE11C8B48FAE1E"
}
```

## Use Cases

1. **Payment Status Page**: Check payment status when user returns from Telr
2. **Webhook Handler**: Verify payment status on callback
3. **Admin Dashboard**: Check order payment status
4. **Retry Logic**: Verify payment before retrying failed transactions

## Related Routes
- `/api/payment/create-telr` - Create Telr payment transaction
- `/payment/checkstatus/{booking_reference}` - Payment status page

## Notes
- This route is simpler than `create-telr` as it only requires `order_ref`
- The `order_ref` is returned from the `create-telr` response
- Used to verify payment completion after user completes payment in Telr iframe
