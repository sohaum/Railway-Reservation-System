<img width="1918" height="1087" alt="Screenshot 2025-09-08 184604" src="https://github.com/user-attachments/assets/fbff20c8-96b1-4b5e-8ca8-45ff11f01d96" /># 🚂 Railway Reservation System

A modern, full-stack railway ticket booking application built with Next.js, TypeScript, and Firebase. This system provides a seamless experience for users to search for trains, book tickets, and manage reservations, while offering administrative capabilities for managing trains and user bookings.

## 🔑 Admin Access

For administrative features and management capabilities, use the following credentials:

**Admin Login:**
- **Email**: `admin@admin.com`
- **Password**: `Admin123`

*Note: These are demo credentials for testing purposes. In production, use secure authentication methods.*

<img width="1918" height="1087" alt="Screenshot 2025-09-08 184604" src="https://github.com/user-attachments/assets/4ccfd3fb-70a3-4b17-9ffd-9f51b8293bbe" />
<img width="1913" height="1087" alt="Screenshot 2025-09-08 184706" src="https://github.com/user-attachments/assets/983b4c4d-6176-40a6-ad1f-db27fc4215b2" />
<img width="1920" height="1085" alt="Screenshot 2025-09-08 184728" src="https://github.com/user-attachments/assets/b7a725fa-1877-4ef5-ae11-ba16b3147147" />
<img width="1920" height="1085" alt="Screenshot 2025-09-08 184755" src="https://github.com/user-attachments/assets/c62e3b3f-7550-41c4-8af1-65a4477e45ba" />


## 🚀 Features

### User Features
- 🔍 Search trains by source, destination, and date
- 🎟️ Book tickets with class selection (AC, Sleeper, etc.)
- 🪑 Select seat preferences
- 📥 Download e-tickets as PDF
- 📱 Responsive design for all devices
- 🔒 Secure user authentication
- 💳 QR Code based payments
- 📊 View booking history and manage reservations

### Admin Features
- 🚂 Add/Edit/Remove train details
- 📊 View and manage all reservations
- 🏷️ Set dynamic pricing for different classes
- 📈 Monitor booking statistics
- 👥 User management capabilities

### Technical Highlights
- ⚡ Next.js 14 with App Router
- 🎨 Material-UI (MUI) for beautiful UI components
- 🔥 Firebase Authentication & Firestore
- 📄 PDF ticket generation with jsPDF
- 📱 Fully responsive design
- 🔒 Type-safe with TypeScript

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, React 18
- **UI Framework**: Material-UI (MUI) v5
- **Backend**: Firebase (Authentication, Firestore)
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: Day.js
- **Charts**: ApexCharts
- **PDF Generation**: jsPDF & html2canvas
- **QR Codes**: qrcode.react

## 📂 Project Structure

```
Railway_Reservation/
├── src/
│   ├── app/                # Next.js app router pages
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard pages
│   │   └── globals.css    # Global styles
│   ├── components/        # Reusable UI components
│   │   ├── auth/         # Authentication components
│   │   ├── core/         # Core UI components
│   │   └── dashboard/    # Dashboard components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and Firebase config
│   ├── types/            # TypeScript type definitions
│   └── styles/           # Theme and styling configs
├── public/               # Static assets
├── dataconnect/          # Firebase Data Connect config
├── package.json          # Dependencies and scripts
└── README.md            # Project documentation
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Railway_Reservation
```

2. **Install dependencies**
```bash
# Using npm
npm install

# Using yarn
yarn install
```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore Database
   - Copy your Firebase configuration

4. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
```

5. **Run the development server**
```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run typecheck    # Run TypeScript type checking

# Formatting
npm run format:write # Format code with Prettier
npm run format:check # Check code formatting
```

## 🔧 Configuration

### Firebase Setup

1. **Authentication**: Enable Email/Password authentication
2. **Firestore Database**: Create collections for:
   - `trains` - Store train information
   - `reservations` - Store booking data
   - `users` - Store user profiles

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key | ✅ |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | ✅ |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | ✅ |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | ✅ |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | ✅ |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID | ✅ |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase Measurement ID | ✅ |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | Firebase Database URL | ✅ |

## 🏗️ Build and Deployment

### Production Build
```bash
npm run build
npm run start
```

### Deployment Options
- **Vercel**: Automatic deployment with GitHub integration (used for this project)
- **Netlify**: Static site deployment
- **Firebase Hosting**: Deploy alongside Firebase backend

## 📱 Usage

### For Users
1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Search Trains**: Enter source, destination, and travel date
3. **Book Tickets**: Select train, class, and number of tickets
4. **Payment**: Complete booking with QR code payment
5. **Download Ticket**: Get PDF ticket after successful booking
6. **Manage Bookings**: View and cancel reservations from dashboard

### For Admins
1. **Train Management**: Add new trains and update existing ones
2. **Reservation Management**: View all bookings and handle cancellations
3. **Analytics**: Monitor booking trends and revenue

## 🐛 Known Issues

- PDF download requires proper browser permissions for file downloads
- QR code payment is currently a mock implementation
- Seat selection is preference-based, not actual seat mapping

## 🔮 Future Enhancements

- [ ] Real payment gateway integration
- [ ] Actual seat mapping and selection
- [ ] Email notifications for bookings
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Loyalty program integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sohaum Ghosh**
- Version: 1.0.7
- Homepage: [http://localhost:3000/auth/sign-in](http://localhost:3000/auth/sign-in)

## 🙏 Acknowledgments

- [Material-UI](https://mui.com/) for the amazing UI components
- [Firebase](https://firebase.google.com/) for the backend services
- [Next.js](https://nextjs.org/) for the React framework
- [TypeScript](https://www.typescriptlang.org/) for type safety

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact: sohaumghosh@gmail.com

---

💡 **Note**: This is a demo project. For production use, please implement proper security measures, input validation, error handling, and real payment processing.
