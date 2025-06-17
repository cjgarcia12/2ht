# 2HT Band Website

A modern, responsive website for the band 2HT built with Next.js, MongoDB, and Tailwind CSS. Features include show listings, music catalog, booking system, and admin panel.

## Features

- 🎵 **Homepage** - Hero section with band intro and quick links
- 📅 **Show Dates** - Display upcoming performances with ticket links
- 🎼 **Music Catalog** - Song listings with streaming links
- 📝 **Booking System** - Contact form for event bookings
- 🔐 **Admin Panel** - Manage events, songs, and bookings
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Clean design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB with Mongoose
- **Icons**: Lucide React
- **Authentication**: JWT (for admin)

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/band-website

# JWT Secret for Admin Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Admin Credentials (for simple auth)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-password
```

### 2. MongoDB Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name band-mongo -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=yourpassword mongo
```

#### Option B: MongoDB Atlas
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in `.env.local`

### 3. Install Dependencies & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the website.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── admin/          # Admin panel (coming soon)
│   ├── shows/          # Show listings page
│   ├── book/           # Booking form page
│   └── layout.tsx      # Root layout
├── components/         # Reusable components
├── lib/               # Utilities and database
│   ├── models/        # Mongoose models
│   ├── mongodb.ts     # MongoDB connection
│   └── mongoose.ts    # Mongoose connection helper
└── types/             # TypeScript type definitions
```

## API Endpoints

### Events
- `GET /api/events` - Get all upcoming events
- `POST /api/events` - Create new event
- `GET /api/events/[id]` - Get specific event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

### Songs
- `GET /api/songs` - Get all songs
- `POST /api/songs` - Create new song

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking request

## Database Models

### Event
- Title, description, date, venue, address, city, state
- Optional: ticket URL, price, image URL

### Song
- Title, artist, album, genre, duration
- Optional: Spotify/YouTube/SoundCloud URLs, lyrics, image

### Booking
- Contact info, event details, venue, message
- Status tracking (pending, confirmed, declined, completed)

## Deployment

### VPS Deployment
1. Set up Node.js and PM2 on your VPS
2. Configure Nginx as reverse proxy
3. Set up SSL with Let's Encrypt
4. Deploy with PM2

```bash
# Build for production
npm run build

# Start with PM2
pm2 start npm --name "band-website" -- start
pm2 startup
pm2 save
```

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
