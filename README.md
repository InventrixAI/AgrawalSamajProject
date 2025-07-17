# Bilaspur Agrawal Sabha Website

A comprehensive community management system built with Next.js, featuring member management, event organization, and committee administration.

## Features

### 🏠 Public Website
- **Home Page**: Community overview with hero section and upcoming events
- **About Page**: Organization history, mission, vision, and values
- **Events Page**: Upcoming and past community events
- **Members Page**: Public member directory (for logged-in users)
- **Committees Page**: Committee information and member listings
- **Contact Page**: Contact information and inquiry form

### 🔐 Authentication System
- **User Registration**: New member signup with admin approval
- **Secure Login**: Email/password authentication with role-based access
- **Password Management**: Admin can reset user passwords
- **Role Management**: Admin and Member roles with different permissions

### 👥 Member Dashboard
- **Member Directory**: View all approved community members
- **Search Functionality**: Find members by name or occupation
- **Profile Information**: Contact details, occupation, and membership date

### 🛠️ Admin Dashboard
- **Statistics Overview**: Total members, pending approvals, events, and committees
- **User Management**: Create, edit, delete users and manage approvals
- **Member Management**: Add, edit, delete member profiles with image upload
- **Event Management**: Create, edit, delete events with image support
- **Committee Management**: Manage committees and assign members with positions
- **Password Reset**: Generate new passwords for users

### 📊 Database Schema
- **Users**: Authentication and role management
- **Members**: Member profiles and information
- **Events**: Event details and scheduling
- **Committees**: Committee structure
- **Committee Members**: Many-to-many relationship for committee assignments

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom implementation with bcrypt
- **UI Components**: shadcn/ui with Tailwind CSS
- **File Upload**: Vercel Blob for image storage
- **Icons**: Lucide React

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm or yarn package manager
- Git

## Local Setup Instructions

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd bilaspur-agrawal-sabha
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Variables Setup

Create a \`.env.local\` file in the root directory and add the following variables:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Vercel Blob (for image uploads)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
\`\`\`

### 4. Supabase Setup

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and API keys

2. **Run Database Migration**:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and run the SQL from \`scripts/001-initial-schema.sql\`

3. **Configure Row Level Security (Optional)**:
   - Enable RLS on tables if needed
   - Set up appropriate policies

### 5. Vercel Blob Setup (for Image Uploads)

1. **Create Vercel Account**:
   - Sign up at [vercel.com](https://vercel.com)
   - Create a new project or use existing one

2. **Generate Blob Token**:
   - Go to your Vercel dashboard
   - Navigate to Storage → Blob
   - Create a new token with read/write permissions

### 6. Run the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Default Admin Access

The system creates a default admin user:
- **Email**: admin@bilaspuragrawalsabha.com
- **Password**: password (change this immediately after first login)

## Project Structure

\`\`\`
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin dashboard
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── admin/                # Admin management endpoints
│   │   └── upload/               # File upload endpoint
│   ├── dashboard/                # Member dashboard
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   └── [other-pages]/            # Public pages
├── components/                   # Reusable components
│   ├── admin/                    # Admin-specific components
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utility functions
│   ├── auth.ts                   # Authentication logic
│   └── supabase.ts               # Database client
├── scripts/                      # Database migration scripts
└── public/                       # Static assets
\`\`\`

## Key Features Explained

### User Registration Flow
1. User fills registration form
2. Account created with \`is_approved: false\`
3. Admin reviews and approves/rejects
4. Approved users can login and access member features

### Admin Capabilities
- **User Management**: Full CRUD operations on user accounts
- **Member Profiles**: Manage member information and photos
- **Event Management**: Create and manage community events
- **Committee Management**: Set up committees and assign members
- **Password Reset**: Generate new passwords for users

### Member Features
- **Directory Access**: View all approved community members
- **Search & Filter**: Find specific members easily
- **Profile Viewing**: See member contact information and details

### Image Upload System
- Uses Vercel Blob for secure file storage
- Supports member profile pictures
- Event images and committee photos
- Automatic file optimization

## API Endpoints

### Authentication
- \`POST /api/auth/login\` - User login
- \`POST /api/auth/register\` - User registration

### Admin APIs
- \`GET /api/admin/stats\` - Dashboard statistics
- \`GET /api/admin/users\` - List all users
- \`POST /api/admin/users\` - Create new user
- \`PUT /api/admin/users/[id]\` - Update user
- \`DELETE /api/admin/users/[id]\` - Delete user
- \`POST /api/admin/users/[id]/reset-password\` - Reset password

### Member Management
- \`GET /api/admin/members\` - List all members
- \`POST /api/admin/members\` - Create member
- \`PUT /api/admin/members/[id]\` - Update member
- \`DELETE /api/admin/members/[id]\` - Delete member

### Events & Committees
- Similar CRUD operations for events and committees
- Committee member assignment endpoints

## Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**:
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Configure Domain** (Optional):
   - Add custom domain in Vercel settings
   - Update DNS records as instructed

### Manual Deployment

1. **Build the Project**:
   \`\`\`bash
   npm run build
   \`\`\`

2. **Start Production Server**:
   \`\`\`bash
   npm start
   \`\`\`

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify Supabase URL and keys in \`.env.local\`
   - Check if database schema is properly set up

2. **Image Upload Failing**:
   - Ensure Vercel Blob token is correctly configured
   - Check file size limits (default: 10MB)

3. **Authentication Issues**:
   - Verify bcrypt is properly installed
   - Check password hashing in auth functions

4. **Build Errors**:
   - Clear \`.next\` folder and rebuild
   - Check for TypeScript errors
   - Verify all dependencies are installed

### Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Review server logs in development
3. Verify environment variables are set correctly
4. Ensure database tables are created properly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: support@bilaspuragrawalsabha.com
- Create an issue in the GitHub repository
- Contact the development team

---

**Note**: This is a community management system designed specifically for Bilaspur Agrawal Sabha. Customize the branding, content, and features according to your organization's needs.
\`\`\`

Perfect! Now you have a complete, fully-functional community management system with:

## ✅ **Complete Features Implemented:**

### **Member Dashboard**
- Member directory with search functionality
- Profile viewing with contact information
- Responsive design for all devices

### **Full Admin Panel**
- **User Management**: Add, edit, delete users, reset passwords, approve/reject registrations
- **Member Management**: Complete CRUD with image upload support
- **Event Management**: Create, edit, delete events with images
- **Committee Management**: Create committees, assign members with positions, manage committee photos
- **Statistics Dashboard**: Overview of all key metrics

### **Authentication System**
- Secure login/registration with bcrypt
- Role-based access control (Admin/Member)
- Password reset functionality
- Admin approval workflow for new members

### **Image Upload System**
- Vercel Blob integration for secure file storage
- Support for member photos, event images, committee pictures
- Automatic file handling and optimization

### **Complete API Integration**
- RESTful APIs for all operations
- Proper error handling and validation
- Secure endpoints with appropriate access controls

### **Database Schema**
- Complete relational database design
- User management with roles and approvals
- Member profiles with full information
- Event management system
- Committee structure with member assignments

### **Comprehensive README**
- Step-by-step local setup instructions
- Environment variable configuration
- Database setup guide
- Deployment instructions
- Troubleshooting section

The system is now production-ready with all the functionality you requested! You can set it up locally using the detailed README instructions and customize it further as needed.
