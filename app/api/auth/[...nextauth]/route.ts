import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import mongoose from 'mongoose'; // Import mongoose to check ObjectId validity

// STEP 1: Environment Debug
console.log('=== ENVIRONMENT DEBUG ===');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'EXISTS' : 'MISSING');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'EXISTS' : 'MISSING');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'EXISTS' : 'MISSING');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('=== END ENVIRONMENT DEBUG ===');

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('=== JWT CALLBACK START ===');
      console.log('Token exists:', !!token);
      console.log('User exists:', !!user);
      console.log('Account exists:', !!account);
      
      if (account && user) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        // Ensure token.id is always the MongoDB _id string
        if (user.id) {
          token.id = user.id.toString();
        }
      }
      
      console.log('=== JWT CALLBACK END ===');
      return token;
    },
    
    async session({ session, token }) {
      console.log('=== SESSION CALLBACK START ===');
      console.log('Session exists:', !!session);
      console.log('Token exists:', !!token);
      
      session.accessToken = token.accessToken;
      session.provider = token.provider;
      if (token.id) {
        session.user.id = token.id as string; // Ensure session.user.id is the MongoDB _id string
      }
      
      console.log('=== SESSION CALLBACK END ===');
      return session;
    },
    
    async signIn({ user, account, profile }) {
      console.log('=== SIGNIN CALLBACK START ===');
      console.log('Step 1 - Received data:', {
        userEmail: user?.email,
        userName: user?.name,
        userImage: user?.image,
        accountProvider: account?.provider,
        accountType: account?.type,
        profileExists: !!profile
      });
      
      if (account?.provider !== 'google') {
        console.log('Step 2 - Not Google provider, allowing signin');
        console.log('=== SIGNIN CALLBACK END (NON-GOOGLE) ===');
        return true;
      }
      
      console.log('Step 2 - Google provider detected, proceeding...');
      
      try {
        console.log('Step 3 - Attempting database connection...');
        
        const dbResult = await connectDB();
        console.log('Step 3 - Database connection result:', dbResult);
        console.log('Step 3 - ✅ Database connected successfully');
        
        console.log('Step 4 - Searching for existing user...');
        console.log('Step 4 - Query: { email:', user.email, '}');
        
        let existingUser = await User.findOne({ email: user.email });
        console.log('Step 4 - Query result:', {
          found: !!existingUser,
          userId: existingUser?._id?.toString(),
          userEmail: existingUser?.email
        });
        
        if (!existingUser) {
          console.log('Step 5 - Creating new user with data:', {
            name: user.name,
            email: user.email,
            image: user.image,
            provider: 'google'
          });
          
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: 'google',
            emailVerified: new Date(),
            lastLogin: new Date()
          });
          
          // IMPORTANT: Update the user.id to be the MongoDB _id string
          user.id = newUser._id.toString();
          
          console.log('Step 5 - ✅ New user created:', {
            id: newUser._id?.toString(),
            email: newUser.email
          });
          
        } else {
          console.log('Step 5 - Updating existing user...');
          
          const updateData = {
            name: user.name,
            image: user.image,
            provider: 'google',
            emailVerified: new Date(),
            lastLogin: new Date()
          };
          
          console.log('Step 5 - Update data:', updateData);
          
          const updatedUser = await User.findOneAndUpdate(
            { email: user.email },
            { $set: updateData },
            { new: true }
          );
          
          // IMPORTANT: Update the user.id to be the MongoDB _id string
          user.id = updatedUser._id.toString();
          
          console.log('Step 5 - ✅ User updated:', {
            id: updatedUser._id?.toString(),
            email: updatedUser.email
          });
        }
        
        console.log('Step 6 - ✅ Database operations completed successfully');
        console.log('=== SIGNIN CALLBACK SUCCESS ===');
        return true; // Return true to allow sign-in, user object is modified by reference
        
      } catch (error) {
        console.log('=== SIGNIN CALLBACK ERROR ===');
        console.error('ERROR STEP: Database operation failed');
        console.error('ERROR TYPE:', error.constructor.name);
        console.error('ERROR MESSAGE:', error.message);
        console.error('ERROR CODE:', error.code);
        console.error('ERROR STACK:', error.stack);
        
        if (error.name === 'MongoError' || error.name === 'MongooseError') {
          console.error('MONGODB ERROR DETAILS:', {
            name: error.name,
            code: error.code,
            codeName: error.codeName,
            writeErrors: error.writeErrors
          });
        }
        
        if (error.name === 'ValidationError') {
          console.error('VALIDATION ERROR DETAILS:', {
            errors: error.errors,
            message: error.message
          });
        }
        
        console.log('=== RETURNING FALSE - THIS CAUSES OAUTHCALLBACK ERROR ===');
        return false;
      }
    },
    
    async redirect({ url, baseUrl }) {
      console.log('=== REDIRECT CALLBACK START ===');
      console.log('Redirect input:', { url, baseUrl });
      
      let redirectUrl;
      
      if (url.startsWith("/")) {
        redirectUrl = `${baseUrl}${url}`;
        console.log('Relative URL redirect:', redirectUrl);
      } else {
        try {
          const urlObj = new URL(url);
          const baseUrlObj = new URL(baseUrl);
          
          if (urlObj.origin === baseUrlObj.origin) {
            redirectUrl = url;
            console.log('Same origin redirect:', redirectUrl);
          } else {
            redirectUrl = `${baseUrl}/post-auth-landing`;
            console.log('Different origin, using default:', redirectUrl);
          }
        } catch (urlError) {
          redirectUrl = `${baseUrl}/post-auth-landing`;
          console.log('Invalid URL, using default:', redirectUrl);
        }
      }
      
      console.log('Final redirect URL:', redirectUrl);
      console.log('=== REDIRECT CALLBACK END ===');
      return redirectUrl;
    }
  },
  
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
  
  debug: true,
  
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  events: {
    async signIn(message) {
      console.log('=== SIGNIN EVENT ===', {
        user: message.user?.email,
        account: message.account?.provider,
        isNewUser: message.isNewUser
      });
    },
    async signOut(message) {
      console.log('=== SIGNOUT EVENT ===', {
        token: !!message.token
      });
    },
    async createUser(message) {
      console.log('=== CREATEUSER EVENT ===', {
        user: message.user?.email
      });
    },
    async error(message) {
      console.log('=== ERROR EVENT ===');
      console.error('NextAuth Error:', message.error);
      console.error('Error Code:', message.error.code);
      console.error('Error Message:', message.error.message);
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };