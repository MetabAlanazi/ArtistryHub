import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
    nextAuthUrl: process.env.NEXTAUTH_URL ? 'Set' : 'Not set',
    nodeEnv: process.env.NODE_ENV || 'Not set'
  })
}

