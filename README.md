# medusa-razorpay-webhook

A Medusa.js plugin that handles Razorpay webhook events for payment processing.

## Features

- Handles Razorpay webhook events
- Currently supports `payment.failed` and `payment.captured` events
- Secure webhook handling with a secret key

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
  `medusa-razorpay-webhook`,
]
```

### 2. Set up environment variable

Add the following variable to your `.env` file:

```
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

Replace `your_razorpay_webhook_secret` with the actual webhook secret provided by Razorpay.

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

## Security

The `RAZORPAY_WEBHOOK_SECRET` is used to verify that incoming webhook requests are actually from Razorpay. Always keep this secret secure and never expose it publicly.

## Development and Extending

If you need to handle additional Razorpay events, you can extend this plugin. Refer to the Medusa documentation on how to extend plugins.

## Troubleshooting

If you're having issues with webhook events not being processed:

1. Ensure your `RAZORPAY_WEBHOOK_SECRET` is correctly set in your `.env` file.
2. Verify that the webhook URL is correctly configured in your Razorpay dashboard.
3. Check your Medusa server logs for any error messages related to webhook processing.

## Support

For any issues or questions, please open an issue in the GitHub repository or contact the plugin maintainer.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.