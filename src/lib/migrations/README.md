# Database Migrations

This directory contains database migration scripts for the 2HTSounds application.

## Running Migrations

### Install dependencies first
```bash
npm install
```

### Run all migrations
```bash
npm run migrate
```

### Run a specific migration
```bash
npm run migrate:single
```

## Available Migrations

### 001-add-event-public-field.ts
- **Purpose**: Adds `isPublic` and `bookingId` fields to existing events
- **Default Values**: 
  - `isPublic: true` (existing events remain public)
  - `bookingId: null` (no booking association for existing events)
- **Safe to run multiple times**: ✅ Yes (idempotent)

## Migration Safety

- All migrations are designed to be **idempotent** (safe to run multiple times)
- Migrations check if changes are needed before applying them
- Comprehensive logging shows exactly what changes are made
- Failed migrations won't affect your data

## Before Running on Production

1. **Backup your database** 
2. Test migrations on a development copy first
3. Review the migration logs carefully
4. Verify the results with the post-migration stats

## Creating New Migrations

1. Create a new file: `00X-migration-name.ts`
2. Export a function that returns `MigrationResult`
3. Add the migration to the `migrations` array in `index.ts`
4. Test thoroughly before deploying

Example migration structure:
```typescript
export async function myMigration(): Promise<MigrationResult> {
  try {
    await connectToDatabase();
    
    // Check if migration is needed
    const needsMigration = await checkCondition();
    
    if (!needsMigration) {
      return { success: true, message: 'Migration not needed' };
    }
    
    // Perform migration
    const result = await performChanges();
    
    return { 
      success: true, 
      message: 'Migration completed',
      modifiedCount: result.modifiedCount 
    };
  } catch (error) {
    return { 
      success: false, 
      message: 'Migration failed',
      errors: [error.message] 
    };
  }
}
``` 