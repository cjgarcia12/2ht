import { Users, Award, MapPin, Clock } from 'lucide-react';

interface SiteSettings {
  aboutPageContent: string;
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
      aboutPageContent: 'Welcome to 2HTSounds! We are a passionate band dedicated to bringing you the best live music experience.',
    };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    // Return defaults if API fails
    return {
      aboutPageContent: 'Welcome to 2HTSounds! We are a passionate band dedicated to bringing you the best live music experience.',
    };
  }
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const stats = [
    { icon: Clock, label: 'Years Active', value: '5+' },
    { icon: Users, label: 'Shows Performed', value: '150+' },
    { icon: MapPin, label: 'Cities Visited', value: '25+' },
    { icon: Award, label: 'Happy Clients', value: '200+' }
  ];

//   const members = [
//     {
//       name: 'Band Member 1',
//       role: 'Lead Vocals/Guitar',
//       bio: 'Bringing energy and passion to every performance.',
//       image: '/images/member1.jpg'
//     },
//     {
//       name: 'Band Member 2',
//       role: 'Bass/Backing Vocals',
//       bio: 'The rhythmic foundation that keeps the music moving.',
//       image: '/images/member2.jpg'
//     },
//     {
//       name: 'Band Member 3',
//       role: 'Drums/Percussion',
//       bio: 'The heartbeat of our sound and driving force.',
//       image: '/images/member3.jpg'
//     }
//   ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 text-pink-400">About 2HTSounds</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-100">
            We are a passionate group of musicians dedicated to bringing unforgettable live music experiences to every event.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Our Story</h2>
            <div className="prose prose-lg mx-auto text-gray-800">
              <div className="text-lg leading-relaxed mb-6">
                {settings.aboutPageContent}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-pink-400">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-600 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold mb-2 text-pink-400">{stat.value}</div>
                <div className="text-gray-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Band Members
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Meet the Band</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {members.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-64 bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                  <Users className="w-24 h-24 text-gray-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{member.name}</h3>
                  <p className="text-pink-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-700">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Why Choose 2HTSounds?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-600 rounded-full mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Professional Excellence</h3>
              <p className="text-gray-700">
                We bring years of experience and a commitment to delivering high-quality performances 
                that exceed expectations.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Crowd Engagement</h3>
              <p className="text-gray-700">
                Our interactive performances create memorable experiences that get everyone involved 
                and having a great time.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-600 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Versatile Repertoire</h3>
              <p className="text-gray-700">
                From classic hits to modern favorites, we adapt our music to match your event&apos;s 
                style and audience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 