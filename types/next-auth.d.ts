import NextAuth from 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    id?: string
    subscription?: { plan?: string }
    profile?: number | null
  }

  interface Session {
    user: DefaultSession['user'] & {
      id?: string
      subscription?: { plan?: string }
      profile?: number | null
    }
  }
}
