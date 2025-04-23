'use client'; // allows withPageAuthRequired() to be called from client side

import React, { useState, useEffect } from 'react';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/* ============================================
   BRAND COLORS
============================================ */
const brandNavy = '#284472';
const brandLightPink = "#fdf5f3";
const brandPink = "#FDEEEA";
const brandLightBrown = "#efe4e1";
const brandBrown = "#675a5e";

/* ============================================
   HEADER COMPONENT
============================================ */
const Header = () => {
    const { user } = useUser();

    return (
        <header style={{ backgroundColor: 'white' }} className="flex justify-between items-center p-4 border-b shadow-md">
            <nav className="flex gap-5 items-center ml-4">
                <Link href="/about" className="text-xl font-medium tracking-wide text-gray-700">
                    About
                </Link>
                <Link href="/explore" className="text-xl font-medium tracking-wide text-gray-700">
                    Explore
                </Link>
            </nav>

            <div className="flex-grow flex justify-center">
                <Link href="/">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/cbcbc59fadb92cbfa94f7a46414d883263e97dc4"
                        alt="Hero"
                        className="w-[200px] max-w-full h-auto self-center"
                    />
                </Link>
            </div>

            <div className="flex gap-4 items-center mr-4">
                {/* Heart/Favorites Button */}
                <Link href="/favorites">
                    <button className="p-2" style={{ color: brandNavy }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                            />
                        </svg>
                    </button>
                </Link>

                {/* Profile Button */}
                <Link href="/profile">
                    <button className="p-2" style={{ color: brandNavy }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                            />
                        </svg>
                    </button>
                </Link>
            </div>
        </header>
    );
};

/* ============================================
   SIDEBAR ITEM COMPONENT
============================================ */
const SidebarItem = ({ label, active = false, onClick, icon = null }: {label: any, active: boolean, onClick: any, icon: any}) => (
    <div
        className={`flex items-center p-4 cursor-pointer ${active ? 'font-semibold' : 'font-normal'} text-black text-lg`}
        onClick={onClick}
    >
        {icon && <span className="mr-2">{icon}</span>}
        <span>{label}</span>
        <span className="ml-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </span>
    </div>
);

/* ============================================
   CLOSET ITEM COMPONENT
============================================ */
const ClosetItem = ({ image, title, buyPrice, rentOption = true, sold = false }: {image: any, title: any, buyPrice: any, rentOption: any, sold: any}) => {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <div className="absolute top-2 right-2 z-10">
                <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white"
                    style={{ color: brandNavy }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill={isFavorite ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>

            <div className="bg-gray-200 aspect-square">
                {/* Placeholder for image */}
                <div className="w-full h-full flex items-center justify-center">
                </div>
            </div>

            <div className="p-3">
                <h3 className="text-sm font-medium text-black mb-2">{title}</h3>
                <div className="flex gap-2">
                    {!sold ? (
                        <>
                            <button
                                style={{ backgroundColor: brandBrown }}
                                className="text-white text-sm py-1 px-3 rounded-sm flex-1"
                            >
                                Buy for {buyPrice}
                            </button>
                            {rentOption && (
                                <button
                                    className="border border-gray-400 text-sm py-1 px-3 rounded-sm flex-1"
                                    style={{ color: brandBrown }}
                                >
                                    Rent
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="bg-gray-300 text-center py-1 px-3 rounded-sm w-full">
                            Sold Out
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ============================================
   TAB BUTTON COMPONENT
============================================ */
const TabButton = ({ label, active, onClick }: {label: any, active: any, onClick: any}) => (
    <button
        className={`py-2 px-4 text-sm font-medium rounded-md ${active ? 'text-white' : 'text-gray-800 bg-gray-100'}`}
        style={{ backgroundColor: active ? brandNavy : undefined }}
        onClick={onClick}
    >
        {label}
    </button>
);

/* ============================================
   FOOTER COMPONENTS
   (Updated with provided footer code)
============================================ */
const FooterColumn: React.FC<{ title: string; links: string[] }> = ({ title, links }) => (
    <div className="flex-1">
        <h3 className="mb-5 text-xs tracking-normal leading-4 text-white uppercase">{title}</h3>
        <ul className="flex flex-col gap-1 text-sm leading-5 text-neutral-400">
            {links.map((link, index) => (
                <li key={index}>
                    <a href="#" className="hover:text-white transition-colors">
                        {link}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

const NewsletterForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Subscribing email:', email);
        setEmail('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
                <div className="flex px-3.5 py-3 border border-neutral-300">
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-1 text-sm leading-5 text-black bg-transparent"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <p className="text-sm leading-5 text-neutral-400">
                    By signing up, you agree to our{' '}
                    <a href="#" className="underline">
                        Privacy Policy
                    </a>{' '}
                    and{' '}
                    <a href="#" className="underline">
                        Terms of Service
                    </a>.
                </p>
            </div>
            <button style={{ backgroundColor: brandLightPink, color: brandNavy }} type="submit" className="px-5 py-3 text-base leading-5 bg-white w-fit">
                Subscribe
            </button>
        </form>
    );
};

const Footer = () => (
    <footer style={{ backgroundColor: brandNavy }} className="px-0 pt-20 pb-11 border border-orange-950">
        <div className="flex justify-between px-10 max-md:flex-col max-md:gap-10">
            <div className="flex gap-6 max-md:flex-col">
                <FooterColumn title="CONTACT US" links={['+1 (844) 326-6000', 'Email Us', 'Mon-Fri 9am-3pm PT']} />
                <FooterColumn title="CUSTOMERS" links={['Start a Return', 'Return Policy', 'FAQ']} />
                <FooterColumn title="COMPANY" links={['About Us', 'Sustainability', 'Careers']} />
            </div>
            <div className="px-6 w-[491px] max-md:w-full">
                <h3 className="mb-6 text-base leading-6 text-white">Get the latest news from us</h3>
                <NewsletterForm />
            </div>
        </div>
        <div className="px-10 mt-20 text-sm leading-5 text-neutral-600">©CEIN</div>
    </footer>
);

/* ============================================
   PROFILE PAGE COMPONENT
============================================ */
const ProfilePage = () => {
    const { user, error, isLoading } = useUser();
    const router = useRouter();

    // Ensure user is logged in - O.C.
    if (!user) {
        return; // ensure user is logged in
    }

    // Check if new user has completed account creation - O.C.
    const newUserCompleted = sessionStorage.getItem("newuser_complete");

    // User information - O.C.
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    // State for active tab in sidebar and closet
    const [activeTab, setActiveTab] = useState('Profile');
    const [activeClosetTab, setActiveClosetTab] = useState('My Closet');

    // Closet items data (placeholder)
    const closetItems = [
        { id: 1, title: 'Gradient Graphic T-shirt', buyPrice: '$10', image: '/images/item1.jpg' },
        { id: 2, title: 'Polo with Tipping Details', buyPrice: '$15', image: '/images/item2.jpg', sold: true },
        { id: 3, title: 'Black Striped T-shirt', buyPrice: '$20', image: '/images/item3.jpg' },
        { id: 4, title: 'Skinny Fit Jeans', buyPrice: '$25', image: '/images/item4.jpg', rentOnly: true },
        { id: 5, title: 'Checkered Shirt', buyPrice: '$17', image: '/images/item5.jpg' },
        { id: 6, title: 'Sleeve Striped T-shirt', buyPrice: '$9', image: '/images/item6.jpg' },
        { id: 7, title: 'Vertical Striped Shirt', buyPrice: '$14', image: '/images/item7.jpg' },
        { id: 8, title: 'Courage Graphic T-shirt', buyPrice: '$20', image: '/images/item8.jpg' }
    ];

    // Filter closet items based on active tab
    const filteredItems =
        activeClosetTab === 'All' || activeClosetTab === 'My Closet'
            ? closetItems
            : activeClosetTab === 'Available'
                ? closetItems.filter(item => !item.sold)
                : activeClosetTab === 'For Rent'
                    ? closetItems.filter(item => item.rentOnly || (!item.sold))
                    : closetItems.filter(item => item.sold);

    const closetTabs = ['All', 'Available', 'For Rent', 'Sold'];

    useEffect(() => {
        if (!isLoading && user) {
            setEmail(user.email || ''); // email from Auth0
            console.log("here: email - " + user.email);

            // Get specific user information from db - O.C.
            fetch(`http://localhost:8800/api/profile?email=${user.email}`)
                .then(response => response.json())
                .then(data => {

                    // I added code in auth0 that stores first_login claim - O.C.
                    const firstLogin = user['http://localhost:3000/first_login'];
                    // Redirect to continue account creation page (where new users are saved to db after completion) - O.C.
                    if (data.users.length <= 0 && (firstLogin && !newUserCompleted)) {
                        router.push('/users/new');

                    } else { // otherwise stay on profile page with subsequent logins
                        console.log("returned: " + data.users[0]); // 1 user should be returned (1 account per email)
                        setFirstName(data.users[0].first_name);
                        setLastName(data.users[0].last_name);
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    }, [user, isLoading, router]);

    const handleUnimplementedClick = (feature: any) => { };

    if (isLoading) {
        return (
            <div style={{ color: brandBrown }} className="min-h-screen flex items-center justify-center">
                <p>Full Name</p>
            </div>
        );
    }

    // Example of how to use info from auth0 user.email
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <div className="container mx-auto py-6 px-4">
                <h1 style={{ color: brandBrown }} className="text-4xl font-medium mb-8">My Account</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Sidebar */}
                    <div className="w-full md:w-1/4">
                        <div className="border rounded-lg overflow-hidden">
                            <SidebarItem label="Profile" active={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')} />
                            <SidebarItem label="Settings" onClick={() => handleUnimplementedClick('Settings')} />
                            <SidebarItem label="Order History" onClick={() => handleUnimplementedClick('Order History')} />
                            <SidebarItem label="Payment Options" onClick={() => handleUnimplementedClick('Payment Options')} />
                            <SidebarItem label="Privacy" onClick={() => handleUnimplementedClick('Privacy')} />
                            <SidebarItem label="Policies" onClick={() => handleUnimplementedClick('Policies')} />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-3/4">
                        {activeTab === 'Profile' ? (
                            <div>
                                {/* User Profile Info */}
                                <div className="flex items-center mb-8">
                                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mr-6 border-4 border-white shadow-lg">
                                        {/* Profile image placeholder */}
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-9">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 style={{ color: brandBrown }} className="text-2xl font-semibold mb-2">
                                            {firstName || 'Full'} {lastName || 'Name'}
                                        </h2>
                                        <div className="mb-2"></div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                <polyline points="22,6 12,13 2,6" />
                                            </svg>
                                            {email || 'Loading...'}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 mt-2">
                                            <span className="mr-2">Rating:</span>
                                            <div className="flex gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                </svg>
                                                <span className="ml-2">_ / 5</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Closet Tabs */}
                                <div className="mb-6 border-b">
                                    <div className="flex gap-4 mb-0">
                                        <button
                                            className={`pb-2 px-1 font-medium text-xl ${activeClosetTab === 'My Closet' ? 'border-b-2' : ''}`}
                                            style={{ color: brandNavy, borderColor: activeClosetTab === 'My Closet' ? brandNavy : undefined }}
                                            onClick={() => setActiveClosetTab('My Closet')}
                                        >
                                            My Closet
                                        </button>
                                        <button
                                            className={`pb-2 px-1 font-medium text-xl ${activeClosetTab === 'Friends' ? 'border-b-2' : ''}`}
                                            style={{ color: brandNavy, borderColor: activeClosetTab === 'Friends' ? brandNavy : undefined }}
                                            onClick={() => handleUnimplementedClick('Friends tab')}
                                        >
                                            Friends
                                        </button>
                                        <button
                                            className={`pb-2 px-1 font-medium text-xl ${activeClosetTab === 'Following' ? 'border-b-2' : ''}`}
                                            style={{ color: brandNavy, borderColor: activeClosetTab === 'Following' ? brandNavy : undefined }}
                                            onClick={() => handleUnimplementedClick('Following tab')}
                                        >
                                            Following
                                        </button>
                                    </div>
                                </div>

                                {/* Filter Tabs */}
                                <div className="flex gap-2 mb-6">
                                    {closetTabs.map(tab => (
                                        <TabButton
                                            key={tab}
                                            label={tab}
                                            active={activeClosetTab === tab}
                                            onClick={() => setActiveClosetTab(tab)}
                                        />
                                    ))}
                                </div>

                                {/* Closet Items Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {filteredItems.map(item => (
                                        <ClosetItem
                                            key={item.id}
                                            title={item.title}
                                            buyPrice={item.buyPrice}
                                            image={item.image}
                                            sold={item.sold}
                                        />
                                    ))}

                                    {/* Add Item Button with square shape */}
                                    <div
                                        className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center cursor-pointer"
                                        onClick={() => handleUnimplementedClick('Upload feature')}
                                    >
                                        <div className="flex flex-col items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="40"
                                                height="40"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-gray-600"
                                            >
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                            <p className="mt-2 text-sm text-gray-600">Click to Upload More Items</p>
                                        </div>
                                    </div>
                                </div>

                                {/* View All Button */}
                                <div className="flex justify-center mt-8">
                                    <button
                                        className="text-sm font-medium"
                                        onClick={() => handleUnimplementedClick('View All')}
                                    >
                                        View All
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                                <p className="text-gray-500">This section is under development.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default withPageAuthRequired(ProfilePage);
