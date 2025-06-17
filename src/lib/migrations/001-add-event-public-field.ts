import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectToDatabase from '../mongoose';
import Event from '../models/Event';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

interface MigrationResult {
  success: boolean;
  message: string;
  modifiedCount?: number;
  errors?: string[];
}

export async function addEventPublicField(): Promise<MigrationResult> {
  console.log('🔄 Starting migration: Add isPublic field to events...');
  
  try {
    // Connect to database
    await connectToDatabase();
    console.log('✅ Connected to database');

    // Ensure database connection exists
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }

    // Check if migration is needed
    const eventsWithoutPublicField = await mongoose.connection.db
      .collection('events')
      .countDocuments({ isPublic: { $exists: false } });

    console.log(`📊 Found ${eventsWithoutPublicField} events without isPublic field`);

    if (eventsWithoutPublicField === 0) {
      console.log('✅ Migration not needed - all events already have isPublic field');
      return {
        success: true,
        message: 'Migration not needed - all events already have isPublic field',
        modifiedCount: 0
      };
    }

    // Update events without isPublic field to set it to true (public by default)
    const result = await mongoose.connection.db
      .collection('events')
      .updateMany(
        { isPublic: { $exists: false } },
        { 
          $set: { 
            isPublic: true,
            // Also ensure bookingId field exists (as null if not set)
            bookingId: null
          }
        }
      );

    console.log(`✅ Migration completed successfully!`);
    console.log(`📝 Modified ${result.modifiedCount} events`);
    console.log(`🌍 All existing events are now set to public by default`);

    // Verify the migration
    const totalEvents = await Event.countDocuments({});
    const publicEvents = await Event.countDocuments({ isPublic: true });
    const privateEvents = await Event.countDocuments({ isPublic: false });

    console.log(`📊 Final state:`);
    console.log(`   Total events: ${totalEvents}`);
    console.log(`   Public events: ${publicEvents}`);
    console.log(`   Private events: ${privateEvents}`);

    return {
      success: true,
      message: `Successfully migrated ${result.modifiedCount} events`,
      modifiedCount: result.modifiedCount
    };

  } catch (error) {
    console.error('❌ Migration failed:', error);
    return {
      success: false,
      message: 'Migration failed',
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  addEventPublicField()
    .then((result) => {
      if (result.success) {
        console.log('🎉 Migration completed successfully!');
        process.exit(0);
      } else {
        console.error('💥 Migration failed!');
        console.error(result.errors?.join('\n'));
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
} 