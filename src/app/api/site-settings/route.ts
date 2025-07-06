import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import SiteSettings from '@/lib/models/SiteSettings';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get settings or create default if none exist
    let settings = await SiteSettings.findOne({});
    
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch site settings' },
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
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update site settings' },
      { status: 500 }
    );
  }
}