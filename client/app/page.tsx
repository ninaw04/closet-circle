'use client';
import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';

import TestComponent from './components/TestComponent';

export default function Home() {
  const { user, isLoading } = useUser();

  // Remove sessionStorage item when there is no user logged in
  if (!user) {
    useEffect(() => {
      sessionStorage.removeItem("newuser_complete");
    });
  }

  // links to redirect to auth0 login and logout
  return (
   <main>
    <div className='p-5 my-5 bg-pink-50 text-gray-800 hover:bg-pink-100'>
      <Link href="/users">Users</Link>
      <br></br>
      <Link href="/profile">Your Profile</Link>
      <br></br>
      {!user && (<a href="/api/auth/login?returnTo=/profile">Login</a>)}
      <br></br>
      {user && (<a href="/api/auth/logout">Logout</a>)}
      <TestComponent />
    </div>
    </main>
  )
}

