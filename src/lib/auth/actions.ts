"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { user, session, account, guest, type User } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

// Zod validation schemas
const signUpSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// const guestSessionSchema = z.object({
//   sessionToken: z.string().uuid(),
// });

// Types
type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Server Actions
export async function signUp(
  formData: FormData
): Promise<ActionResult<{ userId: string }>> {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validatedData = signUpSchema.parse(rawData);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, validatedData.email))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        success: false,
        error: "User with this email already exists",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const [newUser] = await db
      .insert(user)
      .values({
        name: validatedData.name,
        email: validatedData.email,
        emailVerified: false,
      })
      .returning({ id: user.id });

    // Create account record for credentials
    await db.insert(account).values({
      userId: newUser.id,
      accountId: validatedData.email,
      providerId: "credentials",
      password: hashedPassword,
    });

    // Create session
    const sessionToken = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(session).values({
      userId: newUser.id,
      token: sessionToken,
      expiresAt,
    });

    // Set auth session cookie
    (await cookies()).set("auth_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Handle guest session migration
    const guestSessionToken = (await cookies()).get("guest_session")?.value;
    if (guestSessionToken) {
      await mergeGuestCartWithUserCart(guestSessionToken, newUser.id);
      (await cookies()).delete("guest_session");
    }

    return {
      success: true,
      data: { userId: newUser.id },
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Sign up failed",
    };
  }
}

export async function signIn(
  formData: FormData
): Promise<ActionResult<{ userId: string }>> {
  try {
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validatedData = signInSchema.parse(rawData);

    // Find user by email
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, validatedData.email))
      .limit(1);

    if (!foundUser) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Find account with password
    const [userAccount] = await db
      .select()
      .from(account)
      .where(
        and(
          eq(account.userId, foundUser.id),
          eq(account.providerId, "credentials")
        )
      )
      .limit(1);

    if (!userAccount?.password) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      validatedData.password,
      userAccount.password
    );

    if (!isValidPassword) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Create new session
    const sessionToken = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(session).values({
      userId: foundUser.id,
      token: sessionToken,
      expiresAt,
    });

    // Set auth session cookie
    (await cookies()).set("auth_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Handle guest session migration
    const guestSessionToken = (await cookies()).get("guest_session")?.value;
    if (guestSessionToken) {
      await mergeGuestCartWithUserCart(guestSessionToken, foundUser.id);
      (await cookies()).delete("guest_session");
    }

    return {
      success: true,
      data: { userId: foundUser.id },
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Sign in failed",
    };
  }
}

export async function signOut(): Promise<ActionResult<null>> {
  try {
    const sessionToken = (await cookies()).get("auth_session")?.value;

    if (sessionToken) {
      // Delete session from database
      await db.delete(session).where(eq(session.token, sessionToken));
    }

    // Clear auth session cookie
    (await cookies()).delete("auth_session");

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      success: false,
      error: "Sign out failed",
    };
  }
}

export async function createGuestSession(): Promise<
  ActionResult<{ sessionToken: string }>
> {
  try {
    const sessionToken = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(guest).values({
      sessionToken,
      expiresAt,
    });

    // Set guest session cookie
    (await cookies()).set("guest_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return {
      success: true,
      data: { sessionToken },
    };
  } catch (error) {
    console.error("Create guest session error:", error);
    return {
      success: false,
      error: "Failed to create guest session",
    };
  }
}

export async function getGuestSession(): Promise<
  ActionResult<{ sessionToken: string } | null>
> {
  try {
    const sessionToken = (await cookies()).get("guest_session")?.value;

    if (!sessionToken) {
      return {
        success: true,
        data: null,
      };
    }

    // Validate guest session exists and is not expired
    const [guestSession] = await db
      .select()
      .from(guest)
      .where(
        and(
          eq(guest.sessionToken, sessionToken),
          gt(guest.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!guestSession) {
      // Clear invalid cookie
      (await cookies()).delete("guest_session");
      return {
        success: true,
        data: null,
      };
    }

    return {
      success: true,
      data: { sessionToken },
    };
  } catch (error) {
    console.error("Get guest session error:", error);
    return {
      success: false,
      error: "Failed to get guest session",
    };
  }
}

export async function mergeGuestCartWithUserCart(
  guestSessionToken: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _userId: string
): Promise<ActionResult<null>> {
  try {
    // This is a placeholder for cart migration logic
    // In a real implementation, you would:
    // 1. Get guest cart items
    // 2. Get user cart items
    // 3. Merge them (handle duplicates, quantities, etc.)
    // 4. Update user cart
    // 5. Delete guest cart
    // 6. Delete guest session

    // For now, just delete the guest session
    await db.delete(guest).where(eq(guest.sessionToken, guestSessionToken));

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error("Merge guest cart error:", error);
    return {
      success: false,
      error: "Failed to merge guest cart",
    };
  }
}

export async function getCurrentUser(): Promise<
  ActionResult<{ user: User } | null>
> {
  try {
    const sessionToken = (await cookies()).get("auth_session")?.value;

    if (!sessionToken) {
      return {
        success: true,
        data: null,
      };
    }

    // Find valid session
    const [userSession] = await db
      .select({
        userId: session.userId,
        expiresAt: session.expiresAt,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      })
      .from(session)
      .innerJoin(user, eq(session.userId, user.id))
      .where(
        and(eq(session.token, sessionToken), gt(session.expiresAt, new Date()))
      )
      .limit(1);

    if (!userSession) {
      // Clear invalid session cookie
      (await cookies()).delete("auth_session");
      return {
        success: true,
        data: null,
      };
    }

    return {
      success: true,
      data: { user: userSession.user },
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return {
      success: false,
      error: "Failed to get current user",
    };
  }
}

// Forgot Password Action
export async function forgotPassword(
  formData: FormData
): Promise<ActionResult<null>> {
  try {
    const email = formData.get("email") as string;

    if (!email) {
      return {
        success: false,
        error: "Email is required",
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Please enter a valid email address",
      };
    }

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!existingUser) {
      // Don't reveal if user exists or not for security
      return {
        success: true,
        data: null,
      };
    }

    // TODO: Implement actual password reset logic
    // 1. Generate reset token
    // 2. Store token in verification table
    // 3. Send email with reset link
    // 4. Set expiration time

    // For now, just return success
    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      error: "Failed to process password reset request",
    };
  }
}

// Utility function to check if user is authenticated
export async function requireAuth(): Promise<string> {
  const result = await getCurrentUser();

  if (!result.success || !result.data) {
    redirect("/sign-in");
  }

  return result.data.user.id;
}
