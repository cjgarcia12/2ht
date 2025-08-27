import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import SiteSettings from '@/lib/models/SiteSettings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🔍 Site-settings API: Starting GET request');
    console.log('🔍 MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    await connectToDatabase();
    console.log('✅ Database connected successfully');
    
    // Get settings or create default if none exist
    let settings = await SiteSettings.findOne({});
    console.log('🔍 Settings found:', !!settings);
    
    if (!settings) {
      console.log('⚠️ No settings found, creating default settings');
      settings = await SiteSettings.create({});
      console.log('✅ Default settings created');
    }
    
    console.log('🔍 Returning settings:', { 
      id: settings._id, 
      heroTitle: settings.heroTitle?.substring(0, 20) + '...' 
    });
    
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: unknown) {
    console.error('❌ Error in site-settings API:', error);
    console.error('❌ Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('❌ Error message:', error instanceof Error ? error.message : String(error));
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch site settings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { heroTitle, heroDescription, aboutSectionText, aboutPageContent, contactEmail, contactPhone } = body;
    
    // Validate required fields
    if (!heroTitle || !heroDescription || !aboutSectionText || !aboutPageContent) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Update or create settings
    let settings = await SiteSettings.findOne({});
    
    if (settings) {
      settings.heroTitle = heroTitle;
      settings.heroDescription = heroDescription;
      settings.aboutSectionText = aboutSectionText;
      settings.aboutPageContent = aboutPageContent;
      settings.contactEmail = contactEmail;
      settings.contactPhone = contactPhone;
      await settings.save();
    } else {
      settings = await SiteSettings.create({
        heroTitle,
        heroDescription,
        aboutSectionText,
        aboutPageContent,
        contactEmail,
        contactPhone,
      });
    }
    
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: unknown) {
    console.error('❌ Error updating site settings:', error);
    console.error('❌ Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('❌ Error message:', error instanceof Error ? error.message : String(error));
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update site settings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}