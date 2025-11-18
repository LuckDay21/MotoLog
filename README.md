# MotoLog - Smart Motorcycle Service Reminder 🏍️

An adaptive and intelligent motorcycle service reminder app for Indonesian riders.

## ✨ Features

- 🏍️ **Indonesian Motorcycle Database** - Supports 50+ popular models (Yamaha, Honda, Suzuki)
- 📊 **Adaptive Tracking** - Only resets timers for serviced components
- 📱 **Responsive Design** - Mobile-friendly interface
- 🔐 **Firebase Authentication** - Login with email/password or Google
- ☁️ **Cloud Sync** - Automatic data synchronization with Firebase Realtime Database
- 📴 **Offline Mode** - Works without login using localStorage
- 📈 **Visual Progress** - Progress bars for each component
- 📜 **Service History** - Track all service records with cost details
- 🎨 **Modern UI** - Minimalist design with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and Yarn/npm
- Firebase account (free tier)

### Installation

1. Clone this repository:

```bash
git clone https://github.com/yourusername/motolog.git
cd motolog
```

2. Install dependencies:

```bash
yarn install
# or
npm install
```

3. Setup Firebase:

   - Create a new project at [Firebase Console](https://console.firebase.google.com/)
   - Enable **Authentication** (Email/Password and Google)
   - Enable **Realtime Database**
   - Copy credentials from Project Settings

4. Setup environment variables:

```bash
cp .env.example .env
```

5. Edit `.env` file with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_DATABASE_URL=your_database_url_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

6. Run development server:

```bash
yarn dev
# or
npm run dev
```

7. Open browser at `http://localhost:5173`

## 🔒 Firebase Security Rules

Add these rules to Firebase Realtime Database for security:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## 📖 How to Use

### 1. Add Your First Motorcycle

- Click "Add Your First Motorcycle"
- Select brand (e.g., Yamaha)
- Select model (e.g., XMAX 250)
- Enter year and current odometer
- Click "Add Motorcycle"

### 2. Log Service

- Click "Log New Service" button
- Select motorcycle to service
- Enter odometer reading at service
- **Check components that were serviced** (e.g., Engine Oil, CVT Service)
- Add notes and cost (optional)
- Click "Save Service Log"

### 3. Adaptive System Works! 🎉

For example, if you service at 1,500 km and check:

- ✅ Engine Oil Change (2,000 km interval)
- ✅ CVT Service (8,000 km interval)

The system will automatically:

- Reset Engine Oil timer → Next service at **3,500 km**
- Reset CVT timer → Next service at **9,500 km**
- Other components (Gear Oil, Spark Plug, etc.) remain on original schedule

### 4. Monitor Motorcycle Condition

- Dashboard shows most urgent service
- View progress bars for all components
- Color notifications:
  - 🟢 Green: Still safe
  - 🟡 Yellow: Less than 500 km remaining
  - 🔴 Red: Overdue

## 📦 Build for Production

```bash
yarn build
# or
npm run build
```

Production files will be in the `dist/` folder.

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Backend**: Firebase Authentication + Realtime Database
- **State Management**: React Context API
- **Storage**: LocalStorage (fallback) + Firebase Realtime Database

## 📂 Project Structure

```
motolog/
├── src/
│   ├── components/      # Reusable components
│   ├── context/         # React Context providers
│   ├── data/           # Motorcycle templates database
│   ├── pages/          # Page components
│   ├── config/         # Firebase configuration
│   └── assets/         # Static assets
├── .env.example        # Environment variables template
└── README.md
```

## 🎨 Motorcycle Database

Available templates for:

**Yamaha**: XMAX 250, NMAX 155, Aerox 155, Fazzio, Mio Series  
**Honda**: PCX 160, Vario 160, Beat, Scoopy, ADV 160  
**Suzuki**: Nex II, Address

Each motorcycle has default components with accurate service intervals.

## 🔮 Roadmap (Future Features)

- [ ] Push notifications
- [ ] Export history to PDF
- [ ] Nearby workshop integration
- [ ] Service cost budgeting
- [ ] Custom intervals per component
- [ ] Community tips & sharing

## 🤝 Contributing

Contributions are always welcome! Please create an issue or pull request.

## 📄 License

MIT License - free to use for personal or commercial projects.

## 👨‍💻 Author

Created with ❤️ for Indonesian motorcycle community

---

**MotoLog** - Never miss a service again! 🏍️✨
