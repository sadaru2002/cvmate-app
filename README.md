# CVMate - AI-Powered Resume Builder

CVMate is a modern, AI-powered resume builder built with Next.js that helps users create professional resumes with intelligent optimization and multiple templates.

## Features

- 🎨 **Multiple Resume Templates** - Choose from various professional templates
- 🤖 **AI Resume Optimization** - Intelligent suggestions to improve your resume
- 📊 **Resume Analytics** - Get insights on your resume performance
- 🖼️ **Image Management** - Crop and optimize profile photos
- 📄 **PDF Generation** - Export your resume as high-quality PDF
- 🔐 **Authentication** - Secure user accounts with Google Sign-In
- 📱 **Responsive Design** - Works perfectly on all devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **PDF Generation**: Custom PDF generation
- **UI Components**: Shadcn/ui
- **Package Manager**: PNPM

## Getting Started

### Prerequisites

- Node.js 18+ 
- PNPM package manager
- MongoDB database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cvmate-next.git
cd cvmate-next
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
- `MONGODB_URI` - Your MongoDB connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth.js
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── resume-builder/    # Resume builder interface
│   └── templates/         # Resume templates
├── components/            # React components
│   ├── ui/               # UI components
│   ├── resume-builder/   # Resume builder specific components
│   └── layout/           # Layout components
├── lib/                  # Utilities and configurations
├── hooks/                # Custom React hooks
├── contexts/             # React contexts
├── public/               # Static assets
└── styles/               # Global styles
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue on GitHub.