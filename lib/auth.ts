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
  
  // 1. Try JWT token first (for email/password users)
  const token = req.headers.get('authorization')?.split(' ')[1];
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
      console.log('verifyAuth: JWT token found and verified. User ID:', decoded.userId);
      console.log('--- verifyAuth END (JWT) ---');
      return { userId: decoded.userId, email: decoded.email };
    } catch (err) {
      console.warn('verifyAuth: Invalid JWT token, trying session...');
    }
  }

  // 2. Try NextAuth session (for Google OAuth users)
  try {
    const session = await getServerSession(authOptions);
    console.log('verifyAuth: Session check result:', { 
      hasSession: !!session, 
      hasUser: !!session?.user, 
      hasUserId: !!(session?.user as any)?.id 
    });
    
    if (session?.user && (session.user as any).id) {
      console.log('verifyAuth: NextAuth session found. User ID:', (session.user as any).id);
      console.log('--- verifyAuth END (NextAuth) ---');
      return { userId: (session.user as any).id as string, email: session.user.email as string };
    }
  } catch (sessionError) {
    console.warn('verifyAuth: Session check failed:', sessionError);
  }

  // If neither method works
  console.log('verifyAuth: No valid authentication found.');
  console.log('--- verifyAuth END (Failed) ---');
  return { error: 'Authentication required', status: 401 };
  return { error: 'Authentication required', status: 401 };
}