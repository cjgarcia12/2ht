import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Music, MapPin } from 'lucide-react';

interface SiteSettings {
  heroTitle: string;
  heroDescription: string;
  aboutSectionText: string;
}

async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/site-settings`, {
      cache: 'no-store' // Always fetch fresh data
    });
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    }
    
    // Return defaults if API fails
    return {
      heroTitle: '2HTSounds',
      heroDescription: 'Experience the power of live music with our unique sound and energy',
      aboutSectionText: '2HTSounds brings together years of musical experience and passion to create unforgettable live performances. Our diverse repertoire spans multiple genres, ensuring there\'s something for everyone at our shows.',
    };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    // Return defaults if API fails
    return {
      heroTitle: '2HTSounds',
      heroDescription: 'Experience the power of live music with our unique sound and energy',
      aboutSectionText: '2HTSounds brings together years of musical experience and passion to create unforgettable live performances. Our diverse repertoire spans multiple genres, ensuring there\'s something for everyone at our shows.',
    };
  }
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 text-white">
        <div className="absolute inset-0 bg-gray-800/40" />
        <div className="relative container mx-auto px-4 py-24 text-center">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/images/2HTLogoTrimmed.jpg"
              alt="2HTSounds Logo"
              width={300}
              height={300}
              className="mx-auto rounded-full shadow-2xl"
              priority
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-pink-300 bg-clip-text text-transparent">
            {settings.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-100">
            {settings.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/shows" 
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              Upcoming Shows <Calendar className="w-5 h-5" />
            </Link>
            <Link 
              href="/book" 
              className="border-2 border-pink-400 hover:bg-pink-600 hover:border-pink-600 text-pink-400 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Book Us <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-gray-900">About the Band</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {settings.aboutSectionText}
            </p>
            <Link 
              href="/about" 
              className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold"
            >
              Learn More About Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Explore</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Link href="/shows" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-pink-500">
                <Calendar className="w-12 h-12 text-pink-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 group-hover:text-pink-600 transition-colors text-gray-900">
                  Show Dates
                </h3>
                <p className="text-gray-700">
                  Check out our upcoming performances and get your tickets
                </p>
              </div>
            </Link>
            
            <Link href="/songs" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-gray-600">
                <Music className="w-12 h-12 text-gray-700 mb-4" />
                <h3 className="text-xl font-semibold mb-2 group-hover:text-gray-700 transition-colors text-gray-900">
                  Our Music
                </h3>
                <p className="text-gray-700">
                  Explore our songs, both originals and covers
                </p>
              </div>
            </Link>
            
            <Link href="/book" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-pink-500">
                <MapPin className="w-12 h-12 text-pink-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 group-hover:text-pink-600 transition-colors text-gray-900">
                  Book the Band
                </h3>
                <p className="text-gray-700">
                  Hire us for your next event or celebration
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
