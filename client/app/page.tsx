'use client';
import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Home() {
  const { user, isLoading } = useUser();

  // links to redirect to auth0 login and logout
  return (
   <main>
      <h1>Hello World!</h1>
      <Link href="/users">Users</Link>
      <br></br>
      <Link href="/profile">Your Profile</Link>
      <br></br>
      {!user && (<a href="/api/auth/login">Login</a>)}
      <br></br>
      {user && (<a href="/api/auth/logout">Logout</a>)}
    </main>
  )
}

