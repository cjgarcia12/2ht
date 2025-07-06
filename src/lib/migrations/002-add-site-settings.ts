import connectToDatabase from '../mongoose';
import SiteSettings from '../models/SiteSettings';

async function up() {
  console.log('Running migration: 002-add-site-settings');
  
  try {
    await connectToDatabase();
    
    // Check if settings already exist
    const existingSettings = await SiteSettings.findOne({});
    
    if (!existingSettings) {
      // Create default settings
      const defaultSettings = new SiteSettings({
        heroTitle: '2HTSounds',
        heroDescription: 'Experience the power of live music with our unique sound and energy',
        aboutSectionText: '2HTSounds brings together years of musical experience and passion to create unforgettable live performances. Our diverse repertoire spans multiple genres, ensuring there\'s something for everyone at our shows.',
        aboutPageContent: `2HTSounds was born from a shared passion for music and the belief that live performance has the power to bring people together. What started as a group of friends jamming in a garage has evolved into a professional band that has entertained audiences across the region.

Our diverse musical backgrounds allow us to cover a wide range of genres, from classic rock and pop hits to contemporary favorites. We pride ourselves on reading the room and adapting our setlist to create the perfect atmosphere for any event.

Whether you're planning a wedding, corporate event, festival, or private party, 2HTSounds brings the energy and professionalism that will make your event truly memorable.`,
        contactEmail: '',
        contactPhone: '',
      });
      
      await defaultSettings.save();
      console.log('✓ Default site settings created successfully');
    } else {
      console.log('✓ Site settings already exist, skipping creation');
    }
    
  } catch (error) {
    console.error('Error running migration 002-add-site-settings:', error);
    throw error;
  }
}

async function down() {
  console.log('Rolling back migration: 002-add-site-settings');
  
  try {
    await connectToDatabase();
    
    // Remove all site settings
    await SiteSettings.deleteMany({});
    console.log('✓ Site settings removed successfully');
    
  } catch (error) {
    console.error('Error rolling back migration 002-add-site-settings:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  up()
    .then(() => {
      console.log('Migration 002-add-site-settings completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration 002-add-site-settings failed:', error);
      process.exit(1);
    });
}

export { up, down };