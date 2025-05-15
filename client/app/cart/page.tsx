'use client';

import React, { useState, useEffect, useRef } from 'react';
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
interface Product {
    id        : number;
    title     : string;
    price     : number;
    images    : string[];          // empty ⇒ gray placeholder
    isRented?: boolean;
}

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

const CartPage: React.FC = () => {
    const { user }        = useUser();
    const [cartTransactionId, setCartTransactionId] = useState(-1);
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const soldItems = cartItems.filter(item => !item.isRented);
    const subtotal = soldItems.reduce((sum, item) => sum + item.price, 0);
    const taxAmount = subtotal * 0.093;
    const shippingCost = subtotal >= 30 ? 0 : 5.99;
    const grandTotal = subtotal + taxAmount + shippingCost;


    // Calculate total price

    // Handle item removal
    const handleRemoveItem = async (id: number) => {
        try {
            const response = await fetch("http://localhost:8800/api/profile/cart/item", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    transactionId: cartTransactionId, 
                    postId: id,  // id of item to remove
                }),
            });

            const data = await response.json();
            if (response.ok) {
                // Remove the item from cart in the frontend
                setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
            } else {
                console.error("Failed to remove item:", data.error);
            }
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    // Handle checkout
    const handleCheckout = async () => {
        try {
            // fetch pending transaction id
            const transactionIdResponse = await fetch(`http://localhost:8800/api/profile/cart/id?email=${user?.email}`)

            const transactionIdData = await transactionIdResponse.json();
            if (!transactionIdResponse.ok || !transactionIdData.transactionId) {
                console.error('Failed to retrieve transaction ID:', transactionIdData.message || transactionIdData.error);
                alert('Failed to retrieve transaction ID. Please try again.');
                return;
            }
    
            // Update the cartTransactionId state
            setCartTransactionId(transactionIdData.transactionId);

            // finish current transaction
            const checkoutResponse = await fetch(`http://localhost:8800/api/profile/checkout?transactionId=${transactionIdData.transactionId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const checkoutData = await checkoutResponse.json();

            if (!checkoutResponse.ok) {
                console.error('Failed to complete checkout:', checkoutData.error);
                return;
            }
            alert("Checkout completed successfully")
            console.log("Checkout completed succcessfully:", checkoutData);
            setCartItems([]); // SET NEW TRANSACTION ID
            // setCartTransactionId(newCartData.transactionId);
        } catch (error) {
            console.error("Error during checkout process:", error);
        }
    }

    /* Fetch cart items */
    useEffect(() => {
        if (!user) return;
        
        fetch(`http://localhost:8800/api/profile/cart?email=${user.email}`)
        // fetch(`http://localhost:8800/api/profile/cart?email=user1@email.com`)
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched posts: ', data);
                console.log("RAW CART DATA:", data.cart);

                if (!Array.isArray(data.cart)) {
                    console.error("Invalid data format:", data);
                    setCartItems([]);
                    return;
                }

                const transformed: Product[] = data.cart.map((post: any) => ({
                    id: post.post_id,
                    title: post.title,
                    price: post.price ?? 20, // Default price if not provided
                    images: post.images, // Use the images array directly
                    isRented: post.bflag === 1 && post.sflag === 0,
                }));
                setCartItems(transformed);
                setCartTransactionId(data.transId);
            })
            .catch((error) => console.log('Error fetching cart items: ', error));
    }, [user]);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="container mx-auto py-6 px-4 flex-1">
                <h1 className="text-2xl font-semibold mb-6" style={{ color: brandBrown }}>Your Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center">
                        <p className="text-lg text-gray-600">Your cart is empty.</p>
                        <Link
                            href="/explore"
                            className="mt-4 inline-block px-6 py-2 text-white font-medium rounded"
                            style={{ backgroundColor: brandNavy }}
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Cart Items */}
                        <div className="md:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 border p-4 rounded"
                                >
                                    {/* display first image only*/}
                                    <div className="flex gap-2" style={{ color: brandBrown }}>
                                        {item.images && item.images.length > 0 ? (
                                            <img
                                                src={item.images[0]}
                                                alt={`${item.title} - Image 1`}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded">
                                                <span className="text-gray-500 text-sm">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                    <h2 className="text-lg font-medium" style={{ color: brandBrown }}>
                                        {item.title}
                                        {item.isRented && (<span className="text-lg font-medium" style={{ color: brandBrown }}>{" "}
                                            - Request to Rent
                                        </span>
                                        )}
                                    </h2>
                                    <p className="text-gray-600">
                                        ${item.price.toFixed(2)}
                                        {item.isRented && <span> Per Day</span>}
                                    </p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Summary Section */}
                        <div className="p-4 border rounded">
                            <h2 className="text-lg font-medium mb-4" style={{ color: brandBrown }}>Order Summary</h2>
                            <div className="flex justify-between mb-2" style={{ color: brandBrown }}>
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-2" style={{ color: brandBrown }}>
                                <span>Tax</span>
                                <span>${taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-4" style={{ color: brandBrown }}>
                                <span>Shipping</span>
                                <span>{subtotal >= 30 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                            </div>
                            {subtotal < 30 && (
                                <div className="text-sm mb-2" style={{ color: 'rgba(brandBrownRGB, 0.7)' }}>
                                    ${(30 - subtotal).toFixed(2)} more to qualify for free shipping
                                </div>
                            )}
                            <hr className="my-4" />
                            <div className="flex justify-between font-semibold text-lg" style={{ color: brandBrown }}>
                                <span>Total</span>
                                <span>${grandTotal.toFixed(2)}</span>
                            </div>
                            <button
                                className="mt-6 w-full px-4 py-2 text-white font-medium bg-blue-600 rounded"
                                onClick={() => handleCheckout()}
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CartPage;
