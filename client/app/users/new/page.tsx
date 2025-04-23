'use client'
import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This page is for new users to complete account creation
// Saves new users to database
function NewUsersPage() {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const router = useRouter(); // for page redirect
  const { user, error, isLoading } = useUser(); // get this user

  if (!user) {
    return; // ensure user is logged in
  }

  // Submitting the form saves the information to the database through POST
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // get data from this logged in user
    const newUserData = { email: user.email, first_name, last_name, bio};

    // send data through POST
    const response = await fetch('http://localhost:8800/api/users/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUserData),
    });

    const result = await response.json();

    // redirect to profile page when user submits form
    if (response.ok) {
      console.log('User saved:', result);
      sessionStorage.setItem('newuser_complete', 'true'); // prevent redirect back to here after completion
      router.push("/profile");
    } else {
      console.log('Error:', result);
    }
  };

  return (
    <main>
      <h1>Continue Account Creation</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First name"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Last name"
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <br></br>

        <button type="submit">Create Account</button>
      </form>
    </main>
  );
}

export default NewUsersPage;