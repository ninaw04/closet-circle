'use client'; // allows withPageAuthRequired() to be called from client side

import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

const ProfilePage = () => {
  const { user, error, isLoading} = useUser();

  // example of how to use info from auth0
  return (
    
    <main>
      <h1>Profile Page</h1>
      <h2>Welcome {user.name}</h2>
      <Link href="/">Home</Link>
      <br></br>
      <a href="/api/auth/logout">Logout</a>
    </main>
  )
}

// this page requires users to be logged in, otherwise this prompts users to log in
export default withPageAuthRequired(ProfilePage);