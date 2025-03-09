import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { company } = await request.json();

    const domain = company.domain || new URL(company.website).hostname;

    const apiKey = process.env.BIGDATA_API_KEY;
    if (!apiKey) {
      throw new Error('BIGDATA_API_KEY is not set in environment variables.');
    }

    const response = await fetch(`https://company.bigpicture.io/v1/companies/find?domain=${domain}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`BigData API request failed with status ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error enriching company data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to enrich company data',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
