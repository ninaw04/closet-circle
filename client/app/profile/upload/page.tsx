'use client'
import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Checkbox component for form
const Checkbox = ({ isChecked, label, checkHandler, index }: { isChecked: any, label: String, checkHandler: any, index: any }) => {
  return (
    <div>
      <input
        type="checkbox"
        id={`checkbox=${index}`}
        value={isChecked}
        onChange={checkHandler}
      />
      <label htmlFor="checkbox">{label}</label>
    </div>
  );
};

// Item categories
const item_categories = [
  { label: "Women's", checked: false },
  { label: "Men's", checked: false },
  { label: "Shirts", checked: false },
  { label: "Pants", checked: false },
  { label: "Dresses", checked: false },
  { label: "Shoes", checked: false },
  { label: "Hats", checked: false },
  { label: "Jackets", checked: false },
  { label: "Winter", checked: false },
  { label: "Fall", checked: false },
  { label: "Spring", checked: false },
  { label: "Summer", checked: false },
];

// Item conditions
const new_condition = {
  field: "new", // 'field' is what gets saved to the database in the item_condition field
  desc: "New - Never worn",
}
const used_excellent = {
  field: "excellent",
  desc: "Used - Excellent",
}
const used_good = {
  field: "good",
  desc: "Used - Good",
}
const used_fair = {
  field: "fair",
  desc: "Used - Fair",
}

// This page is for user input for creating a post for a clothing item
// Saves post information to database
function UploadPost() {
  // db info needed to store
  const [closet_id, setClosetID] = useState('');
  const [category_id, setCategoryID] = useState('');
  const [title, setTitle] = useState('');
  const [item_picture, setPicturePath] = useState('');
  const [description, setDescription] = useState('');
  const [date_posted, setDate] = useState(getFormattedDate());
  const [clothing_category, setCategory] = useState('');
  const [item_condition, setCondition] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [categoriesBox, setCategoryCheckbox] = useState(item_categories);

  const router = useRouter(); // for page redirect
  const { user, error, isLoading } = useUser(); // get this user

  // Ensure user is logged in
  if (!user) {
    return; 
  }

  // Format date yyyy-mm-dd
  function getFormattedDate() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const yr = date.getFullYear();
    const formattedDate = `${yr}-${month}-${day}`
    console.log(formattedDate);
    return formattedDate;
  }

  // Handler for checkbox
  const onHandleChangeCheckbox = (index: any) => {
    console.log({ index });
    setCategoryCheckbox(
      categoriesBox.map((cat, currentIx) => {
        return currentIx === index
          ? { ...cat, checked: !cat.checked }
          : cat;
      }));

  };

  // Submitting the form saves the information to the database through POST
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Information to be stored
    const postInfo = { closet_id: 0, owner_id: user.email, category_id, title, likes: 0, item_picture, description, date_posted, item_condition };

    // Send data through POST
    const response = await fetch('http://localhost:8800/api/profile/upload-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postInfo),
    });

    const result = await response.json();

    // Redirect to profile page when user submits form
    if (response.ok) {
      console.log('Post saved:', result);
      router.push("/profile");
    } else {
      console.log('Error:', result);
    }
  };

  return (
    <main>
      <h1>Post an Item</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br></br>

        <input
          type="text"
          placeholder="Link to item picture"
          value={item_picture}
          onChange={(e) => setPicturePath(e.target.value)}
        />

        <img src={item_picture != '' ? item_picture : undefined} />

        <br></br>

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br></br>

        <select id="conditionDropdown" value={item_condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="">Select Item Condition</option>
          <option value={new_condition.field}>{new_condition.desc}</option>
          <option value={used_excellent.field}>{used_excellent.desc}</option>
          <option value={used_good.field}>{used_good.desc}</option>
          <option value={used_fair.field}>{used_fair.desc}</option>
        </select>
        {/* <p>You selected: {item_condition}</p> */}

        <br></br>

        <div>
          <p>Select Item Categories:</p>
          {categoriesBox.map((cat, index) => {
            console.log({ index });
            return <Checkbox
              isChecked={cat.checked}
              label={cat.label}
              checkHandler={() => onHandleChangeCheckbox(index)}
              index={index}
            />
          })}
        </div>

        <br></br>

        <button type="submit">Upload Post</button>
      </form>
    </main>
  );
}

export default UploadPost;