import { NextRequest, NextResponse } from 'next/server'

interface PlaceholderParams {
  width: string
  height: string
  id: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: PlaceholderParams }
) {
  try {
    const { width, height, id } = params
    
    // Validate dimensions
    const widthNum = parseInt(width, 10)
    const heightNum = parseInt(height, 10)
    
    if (isNaN(widthNum) || isNaN(heightNum) || widthNum <= 0 || heightNum <= 0) {
      return new NextResponse('Invalid dimensions', { status: 400 })
    }
    
    if (widthNum > 2000 || heightNum > 2000) {
      return new NextResponse('Dimensions too large', { status: 400 })
    }

    // Generate a simple SVG placeholder with the ID as text
    const svg = `
      <svg width="${widthNum}" height="${heightNum}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(widthNum, heightNum) / 10}" 
              fill="white" text-anchor="middle" dominant-baseline="middle">
          ${id}
        </text>
      </svg>
    `

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Placeholder generation error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
