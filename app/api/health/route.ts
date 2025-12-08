import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import mongoose from 'mongoose';
import { ratelimit } from '@/lib/rate-limit';

export async function GET() {
  try {
    await connect();
    
    const state = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    return NextResponse.json({ 
      status: 'healthy',
      mongodb: states[state],
      readyState: state,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        mongodb: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  };
}