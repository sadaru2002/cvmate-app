import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getServerSession } from 'next-auth'; // Import getServerSession
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Import authOptions

interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export async function verifyAuth(req: NextRequest) {
  console.log('--- verifyAuth START ---');
  // 1. Try to get session from NextAuth (for Google OAuth users)
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    console.log('verifyAuth: NextAuth session found. User ID:', session.user.id);
    console.log('--- verifyAuth END (NextAuth) ---');
    return { userId: session.user.id as string, email: session.user.email as string };
  }

  // 2. If no NextAuth session, try to verify with local storage token (for email/password users)
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
      console.log('verifyAuth: JWT token found and verified. User ID:', decoded.userId);
      console.log('--- verifyAuth END (JWT) ---');
      return { userId: decoded.userId, email: decoded.email };
    } catch (err) {
      console.warn('verifyAuth: Invalid JWT token, authentication failed.');
    }
  }

  // If neither method works
  console.log('verifyAuth: No valid authentication found.');
  console.log('--- verifyAuth END (Failed) ---');
  return { error: 'Authentication required', status: 401 };
}