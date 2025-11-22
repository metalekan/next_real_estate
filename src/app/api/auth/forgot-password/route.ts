import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User } from '@/lib/mongodb/db';
import { validateData, ForgotPaswordSchema } from '@/lib/utils/validation'; // Assumed validation utilities
import crypto from 'crypto';
import { sendEmail } from '@/lib/utils/email'; // Your email utility


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // 1. Validate input
        const validation = validateData(ForgotPaswordSchema, body);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format.' },
                { status: 400 }
            );
        }

        const { email } = validation.data!;
        
        // 2. Connect to database and find user
        await connectDB();
        const user = await User.findOne({ email });

        // If user is not found, we still return a generic success message (Security)
        if (!user) {
            console.log(`Password reset requested for unknown email: ${email}`);
            return NextResponse.json(
                { success: true, message: 'If that email address is in our database, we will send you a password reset link.' },
                { status: 200 }
            );
        }

        // 3. Generate a unique, secure, UNHASHED token for the email link
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Hash the token before saving to the database (for security)
        const passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set token expiration (e.g., 1 hour)
        const passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour in milliseconds

        // 4. Save token details to the user record
        user.passwordResetToken = passwordResetToken; // HASHED version
        user.passwordResetExpires = new Date(passwordResetExpires);
        await user.save({ validateBeforeSave: false }); 

        // 5. Construct the reset URL and send the email
        // We send the UNHASHED 'resetToken' in the URL query parameter
        const resetURL = `${request.nextUrl.origin}/reset-password?token=${resetToken}&email=${user.email}`;

        const emailOptions = {
            to: user.email,
            subject: 'Your Password Reset Link (Real Estate App)',
            text: `You requested a password reset. Please click this link to reset your password: ${resetURL}\n\nThis link is valid for 1 hour.`,
            html: `<p>You requested a password reset. Please click the button below to reset your password:</p>
                   <a href="${resetURL}" style="background-color:#4f46e5;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block;font-weight:600;">Reset Password</a>
                   <p style="font-size:12px;color:#6b7280;margin-top:15px;">This link is valid for 1 hour.</p>`,
        };
        
        await sendEmail(emailOptions);

        // Final generic success response
        return NextResponse.json(
            { success: true, message: 'If that email address is in our database, we will send you a password reset link.' },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Forgot Password API error:', error);
        
        // Return a success message even on failure to avoid leaking system information
        return NextResponse.json(
            { success: true, message: 'If that email address is in our database, we will send you a password reset link.' },
            { status: 200 }
        );
    }
}