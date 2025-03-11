import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { company } = await request.json();

    // Mock-Daten für die Entwicklung
    const mockData = {
      name: company.name,
      legal_name: `${company.name} GmbH`,
      website: company.website || '',
      domain: company.domain || '',
      description: 'Ein führendes KI-Unternehmen...',
      founded_year: '2020',
      employee_count: '50-100',
      technologies: [
        'Machine Learning',
        'Neural Networks',
        'Computer Vision',
        'NLP'
      ],
      ai_focus_areas: [
        'Deep Learning',
        'Reinforcement Learning',
        'Natural Language Processing'
      ],
      company_type: 'AI Research & Development',
      industry: 'Artificial Intelligence',
      revenue_range: '1M-10M EUR',
      social_profiles: {
        linkedin: `https://linkedin.com/company/${company.name.toLowerCase().replace(/\s+/g, '-')}`,
        twitter: `https://twitter.com/${company.name.toLowerCase().replace(/\s+/g, '')}`,
      }
    };

    // Simulierte API-Verzögerung
    await new Promise(resolve => setTimeout(resolve, 2000));

    return new NextResponse(JSON.stringify(mockData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Error enriching company data:', error);
    return new NextResponse(
      JSON.stringify({ error: error.message || 'Failed to enrich company data' }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
