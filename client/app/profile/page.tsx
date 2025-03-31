'use client'; // allows withPageAuthRequired() to be called from client side

import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

const ProfilePage = () => {

  const { user, error, isLoading } = useUser();
  if (!user) {
    return; // ensure user is logged in
  }

  const router = useRouter();

  // Check if new user has completed account creation
  const newUserCompleted = sessionStorage.getItem("newuser_complete");

  // Redirect to continue account creation page (where new users are saved to db after completion)
  useEffect(() => {
    if (!isLoading && user) {
      // I added code in auth0 that stores first_login claim (O.C.)
      const firstLogin = user['http://localhost:3000/first_login'];
      if (firstLogin && !newUserCompleted) {
        router.push('/users/new');
      }
    }
  }, [user, isLoading, router]);

  // User information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(user.email);
  var userInfo = { firstName, lastName, email };

  // Get specific user information from db
  fetch(`http://localhost:8800/api/profile?email=${email}`)
    .then(response => response.json())
    .then(data => {
      console.log(data.users[0]); // 1 user should be returned (1 account per email)
      setFirstName(data.users[0].first_name);
      setLastName(data.users[0].last_name);
    })
    .catch(error => console.error('Error:', error));

  if (isLoading) return (
    <main>
      <p>Loading...</p>
    </main>
  )

  // Example of how to use info from auth0 user.email
  return (
    <main>
      <h1>Profile Page</h1>
      <h2>Welcome {firstName} {lastName}</h2>
      <p>User's email: {user.email}</p>
      <Link href="/">Home</Link>
      <br></br>
      <a href="/api/auth/logout">Logout</a>
    </main>
  )

}

// This page requires users to be logged in, otherwise this prompts users to log in
export default withPageAuthRequired(ProfilePage);