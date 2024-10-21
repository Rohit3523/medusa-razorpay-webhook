# medusa-razorpay-webhook

A Medusa.js plugin that handles Razorpay webhook events for payment processing and instantly update order payment status just after the order is completed.

## Features

- Handles Razorpay webhook events
- Currently supports `payment.failed` and `payment.captured` events
- Secure webhook handling with a secret key
- Uses Razorpay order status endpoint for immediate payment verification

## Installation

To install the plugin, run the following command in your Medusa project:

```bash
npm install medusa-razorpay-webhook
```

## Configuration

### 1. Update medusa-config.js

Add `medusa-razorpay-webhook` to the plugins array in your `medusa-config.js` file:

```javascript
const plugins = [
  // ... other plugins
  {
    resolve: `medusa-razorpay-webhook`,
    options: {
      key_id: process.env.RAZORPAY_ID,
      key_secret: process.env.RAZORPAY_SECRET
    }
  },
]
```

### 2. Set up environment variables

Add the following variables to your `.env` file:

```
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
RAZORPAY_ID=your_razorpay_id
RAZORPAY_SECRET=your_razorpay_secret
```

Replace the placeholder values with your actual Razorpay credentials:
- `your_razorpay_webhook_secret`: The webhook secret provided by you in Razorpay
- `your_razorpay_id`: Your Razorpay Key ID
- `your_razorpay_secret`: Your Razorpay Key Secret

## Usage

### Webhook URL

The plugin sets up a webhook endpoint at:

```
/webhook/razorpay
```

For example, if your Medusa server is running locally, the full URL would be:

```
http://localhost:9000/webhook/razorpay
```

Use this URL when configuring webhooks in your Razorpay dashboard.

### Supported Events

Currently, the plugin handles the following Razorpay events:

1. `payment.failed`
2. `payment.captured`

When these events are received, the plugin will process them accordingly within your Medusa instance.

### Checking Order Payment Status

This plugin supports checking if an order is paid when the checkout is completed. Here's how it works:

1. Immediately after the order is completed, the plugin uses the Razorpay order status endpoint to verify the payment status.
2. If the order status endpoint confirms the payment, the order is marked as paid.
3. In case of any failure or if the payment is not immediately confirmed, the plugin will wait for the webhook event to update the order status.

This dual approach ensures that the order status is updated as quickly as possible while also providing a fallback mechanism for cases where there might be delays or issues with the immediate status check.

## Security

The `RAZORPAY_WEBHOOK_SECRET` is used to verify that incoming webhook requests are actually from Razorpay. The `RAZORPAY_ID` and `RAZORPAY_SECRET` are used for authenticating API requests to Razorpay, including the order status checks. Always keep these secrets secure and never expose them publicly.

## Development and Extending

If you need to handle additional Razorpay events or extend the plugin's functionality, you can modify the plugin code. Refer to the Medusa documentation on how to extend plugins.

## Troubleshooting

If you're having issues with webhook events not being processed or payment status checks:

1. Ensure your environment variables (`RAZORPAY_WEBHOOK_SECRET`, `RAZORPAY_ID`, and `RAZORPAY_SECRET`) are correctly set in your `.env` file.
2. Verify that the webhook URL is correctly configured in your Razorpay dashboard.
3. Check your Medusa server logs for any error messages related to webhook processing, Razorpay API calls, or order status checks.
4. Make sure the plugin is properly configured in your `medusa-config.js` file.
5. If orders are not being marked as paid immediately, check if there are any network issues or delays in the Razorpay API response.

## Support

For any issues or questions, please open an issue in the GitHub repository or contact the plugin maintainer.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.