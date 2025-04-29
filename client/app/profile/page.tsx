'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/* ============================================
   BRAND COLORS
============================================ */
const brandNavy       = '#284472';
const brandLightPink  = '#fdf5f3';
const brandBrown      = '#675a5e';

/* ============================================
   TYPES
============================================ */
interface ClosetProduct {
    id         : number | string;
    title      : string;
    price      : number;
    forSale    : boolean;
    forRent    : boolean;
    sold?      : boolean;
    type?      : string;
    audience?  : string;
    colors?    : string[];
    sizes?     : string[];
    condition? : string;
    description?: string;
    images     : string[];          // [] ⇒ gray placeholder
}

/* ─── TEMP PLACEHOLDER ITEM (added to test UI!) ───────────────────────────────────────── */
const PLACEHOLDER: ClosetProduct = {
    id        : 10,
    title     : 'White Mini Dress',
    price     : 35,
    forSale   : true,
    forRent   : true,
    type      : 'Dresses',
    audience  : 'Womens',
    colors    : ['white'],
    sizes     : ['Small'],
    condition : 'Brand new',
    description: 'Elegant white mini-dress, size S.',
    images    : [
        'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRG0fVSiGZw4HBqX7J0baOM1qogSWeeliHJt14VP-4t9xW9P5i6CaiYRdqZaensMNXdcrPl3kQdANfNQUEo7CMJbYOFUnYUTeR2-_A4-0eE_vy-3LcAf9aplg',
        'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRX1cmSzFeL_MKu1PAsa9sSKQ7I3uHU7kKss01bEG88ACaj_8k0aO4opTRdu7l8WVS-BCW2jzyGTpjOB9PrzIkRXzFJC-8Q3yboxOGE_OLs6stOZeNSpbDPew'
    ],
};

/* ============================================
   HEADER
============================================ */
const Header: React.FC = () => {
    const { user }        = useUser();
    const [open, setOpen] = useState(false);
    const dropdownRef     = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open) return;
        const h = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [open]);

    return (
        <header className="flex items-center justify-between p-4 border-b shadow-md bg-white relative z-30">
            {/* left nav */}
            <nav className="flex gap-5 items-center ml-4">
                <Link href="/about"   className="text-xl font-medium tracking-wide text-gray-700">About</Link>
                <Link href="/explore" className="text-xl font-medium tracking-wide text-gray-700">Explore</Link>
            </nav>

            {/* centre logo */}
            <div className="flex-grow flex justify-center">
                <Link href="/">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/cbcbc59fadb92cbfa94f7a46414d883263e97dc4"
                        alt="Closet Circle"
                        className="w-[200px] h-auto"
                    />
                </Link>
            </div>

            {/* right buttons */}
            <div className="flex gap-4 items-center mr-4">
                {/* favourites always visible */}
                <Link href="/favorites">
                    <button className="p-2" style={{ color: brandNavy }} aria-label="Favourites">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312
                 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3
                 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                    </button>
                </Link>

                {!user ? (
                    <>
                        <a
                            href="/api/auth/login"
                            style={{ backgroundColor: brandLightPink, color: brandNavy }}
                            className="px-4 py-2 text-sm font-semibold rounded"
                        >
                            Log In
                        </a>
                        <a
                            href="/api/auth/login?screen_hint=signup"
                            style={{ backgroundColor: brandLightPink, color: brandBrown }}
                            className="px-4 py-2 text-sm font-semibold rounded"
                        >
                            Sign Up
                        </a>
                    </>
                ) : (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setOpen(!open)}
                            className="p-2 flex items-center gap-1"
                            style={{ color: brandNavy }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501
                   20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0
                   0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                                 viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0
                   011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.25
                   8.27a.75.75 0 01-.02-1.06z"
                                      clipRule="evenodd" />
                            </svg>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg py-1 text-sm">
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    style={{ color: brandNavy }}
                                    onClick={() => setOpen(false)}
                                >
                                    View Profile
                                </Link>
                                <a
                                    href="/api/auth/logout"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    style={{ color: brandNavy }}
                                >
                                    Logout
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

/* ============================================
   SIDEBAR & TAB BUTTON
============================================ */
const SidebarItem = ({
                         label,
                         active,
                         onClick,
                     }: {
    label: string;
    active: boolean;
    onClick: () => void;
}) => (
    <div
        onClick={onClick}
        className={`flex items-center p-4 cursor-pointer ${
            active ? 'font-semibold' : 'font-normal'
        } text-black text-lg`}
    >
        <span>{label}</span>
        <span className="ml-auto">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
           viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </span>
    </div>
);

const TabButton = ({
                       label,
                       active,
                       onClick,
                   }: {
    label: string;
    active: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className={`py-2 px-4 text-sm font-medium rounded-md ${
            active ? 'text-white' : 'text-gray-800 bg-gray-100'
        }`}
        style={{ backgroundColor: active ? brandNavy : undefined }}
    >
        {label}
    </button>
);

/* ============================================
   CLOSET CARD
============================================ */
const ClosetCard: React.FC<{ product: ClosetProduct }> = ({ product }) => {
    const [idx, setIdx]   = useState(0);
    const [open, setOpen] = useState(false);
    const ref             = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open) return;
        const h = (e: MouseEvent) =>
            ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [open]);

    const imgs       = product.images;
    const imgCount   = imgs.length;
    const nextImg    = () => setIdx((idx + 1) % imgCount);
    const prevImg    = () => setIdx((idx - 1 + imgCount) % imgCount);
    const unavailable =
        product.sold || (!product.forSale && !product.forRent);

    return (
        <div ref={ref} className="relative bg-gray-100 rounded-lg border overflow-visible">
            {/* image / carousel */}
            {imgCount ? (
                <div className="relative">
                    <img
                        src={imgs[idx]}
                        alt={product.title}
                        className="aspect-square w-full object-cover"
                    />
                    {imgCount > 1 && (
                        <>
                            <button
                                onClick={prevImg}
                                className="absolute left-1 top-1/2 -translate-y-1/2
                  bg-black/70 text-white rounded-full p-1"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M12.293 4.293a1 1 0 010 1.414L8.414
                      10l3.879 4.293a1 1 0 11-1.586
                      1.414l-4.5-5a1 1 0
                      010-1.414l4.5-5a1 1 0
                      011.586 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={nextImg}
                                className="absolute right-1 top-1/2 -translate-y-1/2
                  bg-black/70 text-white rounded-full p-1"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M7.707 4.293a1 1 0 000 1.414L11.586
                      10l-3.879 4.293a1 1 0
                      001.586 1.414l4.5-5a1 1 0
                      000-1.414l-4.5-5a1 1 0
                      00-1.586 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="bg-gray-200 aspect-square w-full" />
            )}

            {/* title + buy/rent */}
            <div className="p-3">
                <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-black mb-2 pr-2 line-clamp-2">
                        {product.title}
                    </h3>
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-1 text-sm text-black"
                    >
                        <span>See more</span>
                        <svg
                            className={`w-5 h-5 transition-transform ${
                                open ? 'rotate-180' : ''
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10
                  10.94l3.71-3.71a.75.75 0
                  011.08 1.04l-4.25 4.25a.75.75 0
                  01-1.08 0L5.25 8.27a.75.75 0
                  01-.02-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                <div className="flex gap-2">
                    {unavailable ? (
                        <div className="bg-gray-300 text-center py-1 px-3 rounded-sm w-full text-sm">
                            Unavailable
                        </div>
                    ) : (
                        <>
                            {product.forSale && (
                                <button
                                    className="text-white text-sm py-1 px-3 rounded-sm flex-1"
                                    style={{ backgroundColor: brandBrown }}
                                >
                                    Buy for ${product.price}
                                </button>
                            )}
                            {product.forRent && (
                                <button
                                    className="border border-gray-400 text-sm py-1 px-3 rounded-sm flex-1"
                                    style={{ color: brandBrown }}
                                >
                                    Rent
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {open && (
                <div
                    className="absolute left-0 right-0 top-full mt-1 bg-gray-100
            border border-gray-300 border-t-0 rounded-b-md p-4
            text-sm text-black z-[100]"
                >
                    {product.sizes?.length && (
                        <p>
                            <strong>Sizes:</strong> {product.sizes.join(', ')}
                        </p>
                    )}
                    {product.colors?.length && (
                        <p>
                            <strong>Colors:</strong> {product.colors.join(', ')}
                        </p>
                    )}
                    {product.condition && (
                        <p>
                            <strong>Condition:</strong> {product.condition}
                        </p>
                    )}
                    {product.description && (
                        <p>
                            <strong>Description:</strong> {product.description}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

/* ============================================
   FOOTER
============================================ */
const FooterColumn: React.FC<{ title: string; links: string[] }> = ({
                                                                        title,
                                                                        links,
                                                                    }) => (
    <div className="flex-1">
        <h3 className="mb-5 text-xs tracking-normal leading-4 text-white uppercase">
            {title}
        </h3>
        <ul className="flex flex-col gap-1 text-sm leading-5 text-neutral-400">
            {links.map((l) => (
                <li key={l}>
                    <a href="#" className="hover:text-white transition-colors">
                        {l}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

const NewsletterForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setEmail('');
    };
    return (
        <form onSubmit={submit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
                <div className="flex px-3.5 py-3 border border-neutral-300">
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-1 text-sm leading-5 text-black bg-transparent"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    </a>
                    .
                </p>
            </div>
            <button
                type="submit"
                className="px-5 py-3 text-base leading-5 bg-white w-fit"
                style={{ backgroundColor: brandLightPink, color: brandNavy }}
            >
                Subscribe
            </button>
        </form>
    );
};

const Footer: React.FC = () => (
    <footer
        style={{ backgroundColor: brandNavy }}
        className="px-0 pt-20 pb-11 border border-orange-950"
    >
        <div className="flex justify-between px-10 max-md:flex-col max-md:gap-10">
            <div className="flex gap-6 max-md:flex-col">
                <FooterColumn
                    title="CONTACT US"
                    links={['+1 (844) 326-6000', 'Email Us', 'Mon-Fri 9am-3pm PT']}
                />
                <FooterColumn
                    title="CUSTOMERS"
                    links={['Start a Return', 'Return Policy', 'FAQ']}
                />
                <FooterColumn
                    title="COMPANY"
                    links={['About Us', 'Sustainability', 'Careers']}
                />
            </div>
            <div className="px-6 w-[491px] max-md:w-full">
                <h3 className="mb-6 text-base leading-6 text-white">
                    Get the latest news from us
                </h3>
                <NewsletterForm />
            </div>
        </div>
        <div className="px-10 mt-20 text-sm leading-5 text-neutral-600">©CEIN</div>
    </footer>
);

/* ============================================
   PROFILE PAGE
============================================ */
const ProfilePage: React.FC = () => {
    const { user, isLoading } = useUser();
    const router               = useRouter();

    /* basic profile state */
    const [firstName, setFirstName] = useState('');
    const [lastName,  setLastName ] = useState('');
    const [email,     setEmail    ] = useState('');

    /* ui state */
    const [activeTab]       = useState('Profile');
    const [activeClosetTab, setActiveClosetTab] =
        useState<'All' | 'Available' | 'For Rent' | 'Sold' | 'My Closet'>(
            'My Closet'
        );
    const closetTabs = ['All', 'Available', 'For Rent', 'Sold'] as const;

    /* closet data (start with placeholder) */
    const [closetItems, setClosetItems] = useState<ClosetProduct[]>([
        PLACEHOLDER,
    ]);

    // Ensure user is logged in - O.C.
    if (!user) {
        return;
    }

    // Check if new user has completed account creation - O.C.
    const newUserCompleted = sessionStorage.getItem("newuser_complete");

    // Redirect to continue account creation page if new user
    // Otherwise display profile name
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


    /* fetch user’s closet */
    useEffect(() => {
        if (!user) return;
        fetch(`http://localhost:8800/api/profile/posts?ownerID=${user.email}`)
        // fetch(`http://localhost:8800/api/profile/posts?ownerID=user1@email.com`) // for testing purposes
            .then((r) => r.json())
            .then((data) => {
                const transformed: ClosetProduct[] = data.posts.map((p: any) => ({
                    id        : p.post_id,
                    title     : p.title,
                    price     : p.price ?? 20,
                    forSale   : !p.rent_only,
                    forRent   : p.rent_only ?? false,
                    sold      : p.sold ?? false,
                    images    : p.item_picture ? [p.item_picture] : [],
                    type      : p.type,
                    audience  : p.audience,
                    colors    : p.colors ?? [],
                    sizes     : p.sizes ?? [],
                    condition : p.condition,
                    description: p.description,
                }));
                /* keep placeholder first if you still want to see it when data exists
                   — remove if you only need it when list would otherwise be empty */
                setClosetItems(
                    transformed.length ? [PLACEHOLDER, ...transformed] : [PLACEHOLDER]
                );
            })
            .catch(console.error);
    }, [user]);



    /* filtered view */
    const filtered = closetItems.filter((item) => {
        if (activeClosetTab === 'All' || activeClosetTab === 'My Closet') return true;
        if (activeClosetTab === 'Available') return !item.sold;
        if (activeClosetTab === 'For Rent') return item.forRent && !item.sold;
        return item.sold;
    });

    /* loading / unauth */
    //if (!user) return null;
    if (isLoading)
        return (
            <div
                style={{ color: brandBrown }}
                className="min-h-screen flex items-center justify-center"
            >
                Loading…
            </div>
        );

    /* page */
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <div className="container mx-auto py-6 px-4">
                <h1 style={{ color: brandBrown }} className="text-4xl font-medium mb-8">
                    My Account
                </h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* sidebar */}
                    <div className="w-full md:w-1/4 border rounded-lg overflow-hidden">
                        <SidebarItem
                            label="Profile"
                            active
                            onClick={() => {}}
                        />
                        <SidebarItem label="Settings" active={false} onClick={() => {}} />
                        <SidebarItem
                            label="Order History"
                            active={false}
                            onClick={() => {}}
                        />
                        <SidebarItem
                            label="Payment Options"
                            active={false}
                            onClick={() => {}}
                        />
                        <SidebarItem label="Privacy" active={false} onClick={() => {}} />
                        <SidebarItem label="Policies" active={false} onClick={() => {}} />
                    </div>

                    {/* main */}
                    <div className="w-full md:w-3/4">
                        {/* profile header */}
                        <div className="flex items-center mb-8">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mr-6 border-4 border-white shadow-lg flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-9"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0
                      0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1
                      14.998 0A17.933 17.933 0 0 1 12
                      21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h2
                                    style={{ color: brandBrown }}
                                    className="text-2xl font-semibold mb-2"
                                >
                                    {firstName || 'Full'} {lastName || 'Name'}
                                </h2>
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-2"
                                    >
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0
                      1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2
                      2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                    {email}
                                </div>
                            </div>
                        </div>

                        {/* closet nav */}
                        <div className="mb-6 border-b">
                            <div className="flex gap-4">
                                <button
                                    className={`pb-2 px-1 font-medium text-xl ${
                                        activeClosetTab === 'My Closet' ? 'border-b-2' : ''
                                    }`}
                                    style={{
                                        color: brandNavy,
                                        borderColor:
                                            activeClosetTab === 'My Closet' ? brandNavy : undefined,
                                    }}
                                    onClick={() => setActiveClosetTab('My Closet')}
                                >
                                    My Closet
                                </button>
                                <button
                                    className="pb-2 px-1 font-medium text-xl"
                                    style={{ color: brandNavy }}
                                    onClick={() => {}}
                                >
                                    Friends
                                </button>
                                <button
                                    className="pb-2 px-1 font-medium text-xl"
                                    style={{ color: brandNavy }}
                                    onClick={() => {}}
                                >
                                    Following
                                </button>
                            </div>
                        </div>

                        {/* filter tabs */}
                        <div className="flex gap-2 mb-6">
                            {closetTabs.map((t) => (
                                <TabButton
                                    key={t}
                                    label={t}
                                    active={activeClosetTab === t}
                                    onClick={() =>
                                        setActiveClosetTab(t as typeof activeClosetTab)
                                    }
                                />
                            ))}
                        </div>

                        {/* grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {filtered.map((p) => (
                                <ClosetCard key={p.id} product={p} />
                            ))}

                            {/* “add item” square */}
                            <div
                                className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center cursor-pointer"
                                onClick={() => {router.push('/profile/upload-item')}}
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
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Click to Upload More Items
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default withPageAuthRequired(ProfilePage);