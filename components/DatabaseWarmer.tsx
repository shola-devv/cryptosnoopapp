'use client';
import { useEffect } from 'react';

export default function DatabaseWarmer() {
  useEffect(() => {
    // Warm up database connection on app load
    console.log('🔥 Warming up database connection...');
    
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        console.log('✅ Database warmed up:', data);
      })
      .catch(err => {
        console.error('❌ Database warmup failed:', err);
      });
  }, []);

  return null; // This component doesn't render anything
}