// Simple email service without external dependencies

// Simple email service that doesn't require React Email
export async function sendPasswordResetEmailSimple(
  email: string,
  resetToken: string
) {
  try {
    const resetUrl = `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/reset-password?token=${resetToken}`;

    // For development, just log the token
    console.log("🔑 Password Reset Token:", resetToken);
    console.log("🔗 Reset URL:", resetUrl);
    console.log("📧 Email would be sent to:", email);

    // In production, you would integrate with an email service here
    // For now, we'll just return success and log the token
    return { success: true, data: { token: resetToken } };
  } catch (error) {
    console.error("Email service error:", error);
    return { success: false, error: "Email service unavailable" };
  }
}
