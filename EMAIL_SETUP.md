# Email Setup Guide

## Current Status

The forgot password functionality is now implemented but requires email service configuration to actually send emails.

## Required Environment Variables

Add these to your `.env.local` file:

```env
# Resend API Key (for sending emails)
RESEND_API_KEY=your_resend_api_key_here

# Your domain for email links
NEXTAUTH_URL=http://localhost:3000
```

## Email Service Setup

### Option 1: Resend (Recommended)

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env.local` file

### Option 2: Other Email Services

You can modify `src/lib/email.ts` to use other services like:

- SendGrid
- Mailgun
- AWS SES
- Nodemailer with SMTP

## Testing Without Email Service

For development/testing, you can:

1. **Check the console logs** - The reset token will be logged
2. **Use the token directly** - Visit `/reset-password?token=YOUR_TOKEN_HERE`
3. **Mock the email service** - Modify the email function to just log the token

## Current Implementation

- ✅ **Token Generation**: Secure UUID tokens with 1-hour expiration
- ✅ **Database Storage**: Tokens stored in verification table
- ✅ **Email Template**: Professional Nike-branded email template
- ✅ **Security**: Tokens are single-use and expire automatically
- ✅ **Password Hashing**: Secure bcrypt hashing for new passwords

## Next Steps

1. **Set up Resend account** and get API key
2. **Add environment variables** to `.env.local`
3. **Test the flow** by requesting password reset
4. **Check your email** for the reset link
5. **Complete password reset** using the link

## Production Considerations

- **Domain Verification**: Verify your domain with Resend
- **Email Templates**: Customize the email template for your brand
- **Rate Limiting**: Implement rate limiting for password reset requests
- **Monitoring**: Set up email delivery monitoring
