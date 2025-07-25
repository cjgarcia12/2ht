// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { addEventPublicField } from './001-add-event-public-field';
import { up as addSiteSettings } from './002-add-site-settings';

interface Migration {
  id: string;
  name: string;
  run: () => Promise<{ success: boolean; message: string; modifiedCount?: number; errors?: string[] }>;
}

const migrations: Migration[] = [
  {
    id: '001',
    name: 'Add isPublic field to events',
    run: addEventPublicField
  },
  {
    id: '002',
    name: 'Add site settings',
    run: async () => {
      try {
        await addSiteSettings();
        return { success: true, message: 'Site settings migration completed' };
      } catch (error) {
        return { success: false, message: `Site settings migration failed: ${error}` };
      }
    }
  }
  // Add more migrations here as needed
];

export async function runMigrations(): Promise<void> {
  console.log('🚀 Starting database migrations...');
  console.log(`📋 Found ${migrations.length} migration(s) to run\n`);

  let successCount = 0;
  let failureCount = 0;

  for (const migration of migrations) {
    console.log(`▶️  Running migration ${migration.id}: ${migration.name}`);
    console.log('─'.repeat(50));

    try {
      const result = await migration.run();
      
      if (result.success) {
        console.log(`✅ Migration ${migration.id} completed successfully`);
        if (result.modifiedCount !== undefined) {
          console.log(`   Modified ${result.modifiedCount} records`);
        }
        successCount++;
      } else {
        console.log(`❌ Migration ${migration.id} failed: ${result.message}`);
        if (result.errors) {
          result.errors.forEach(error => console.log(`   Error: ${error}`));
        }
        failureCount++;
      }
    } catch (error) {
      console.log(`💥 Migration ${migration.id} crashed:`, error);
      failureCount++;
    }

    console.log(''); // Empty line for spacing
  }

  console.log('🏁 Migration Summary:');
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failureCount}`);
  console.log(`   📊 Total: ${migrations.length}`);

  if (failureCount > 0) {
    console.log('\n⚠️  Some migrations failed. Please check the errors above.');
    process.exit(1);
  } else {
    console.log('\n🎉 All migrations completed successfully!');
    process.exit(0);
  }
}

// Run all migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .catch((error) => {
      console.error('💥 Migration runner failed:', error);
      process.exit(1);
    });
}