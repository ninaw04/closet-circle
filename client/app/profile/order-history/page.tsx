'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Header, Footer, type Product, PRODUCTS } from '../../explore/page';

const brandNavy = '#284472';
const brandBrown = '#675a5e';
const ITEMS_PER_PAGE = 6;

const OrderHistoryPage: React.FC = () => {
    const [tab, setTab] = useState<'Purchased' | 'Requested'>('Purchased');
    const [purchasedPage, setPurchasedPage] = useState(1);
    const [requestedPage, setRequestedPage] = useState(1);
    const listRef = useRef<HTMLDivElement | null>(null);

    const placeholderPurchased: Product[] = Array(12).fill(0).map((_, i) => ({
        ...PRODUCTS[i % PRODUCTS.length],
        id: i + 1,
    }));

    const placeholderRequested: (Product & { status: 'Pending' | 'Approved' })[] = Array(10).fill(0).map((_, i) => ({
        ...PRODUCTS[(i + 2) % PRODUCTS.length],
        id: 100 + i,
        status: i % 2 === 0 ? 'Pending' : 'Approved',
    }));

    const paginate = <T,>(items: T[], page: number) => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return items.slice(start, start + ITEMS_PER_PAGE);
    };

    const scrollToTop = () => {
        listRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToTop, [purchasedPage, requestedPage]);

    const renderItem = (item: Product & { status?: string }) => (
        <div key={item.id} className="flex items-center gap-4 border p-4 rounded relative">
            <div className="flex gap-2">
                {item.images.length > 0 ? (
                    item.images.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt={`${item.title} - Image ${i + 1}`}
                            className="w-20 h-20 object-cover rounded"
                        />
                    ))
                ) : (
                    <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded">
                        <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                )}
            </div>
            <div className="flex-1">
                <h2 className="text-lg font-medium" style={{ color: brandBrown }}>
                    {item.title}
                </h2>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Ordered on: 2025-04-22</p>
            </div>
            {item.status && (
                <span
                    className="absolute top-2 right-2 text-xs font-medium bg-white border px-2 py-1 rounded shadow"
                    style={{
                        color: item.status === 'Approved' ? 'green' : 'orange',
                        borderColor: item.status === 'Approved' ? 'green' : 'orange',
                    }}
                >
                    {item.status}
                </span>
            )}
        </div>
    );

    const tabItems = tab === 'Purchased' ? placeholderPurchased : placeholderRequested;
    const currentPage = tab === 'Purchased' ? purchasedPage : requestedPage;
    const pageCount = Math.ceil(tabItems.length / ITEMS_PER_PAGE);
    const pagedItems = paginate(tabItems, currentPage);

    const handlePageChange = (newPage: number) => {
        if (tab === 'Purchased') setPurchasedPage(newPage);
        else setRequestedPage(newPage);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <div className="container mx-auto py-6 px-4 flex-1">
                <h1 style={{ color: brandBrown }} className="text-4xl font-medium mb-8">My Account</h1>
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-1/4 border rounded-lg overflow-hidden">
                        {['Profile', 'Order History', 'Seller History','Policies'].map((label) => (
                            <div
                                key={label}
                                onClick={() => {
                                    if (label === 'Profile') location.href = '/profile';
                                    if (label === 'Order History') location.href = '/profile/order-history';
                                    if (label === 'Seller History') location.href = '/profile/seller-history';
                                    if (label === 'Policies') location.href = '/policies';
                                }}
                                className={`flex items-center p-4 cursor-pointer ${
                                    label === 'Order History' ? 'font-semibold' : 'font-normal'
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
                        ))}
                    </div>

                    {/* Main content */}
                    <div className="w-full md:w-3/4">
                        <h2 style={{ color: brandBrown }} className="text-2xl font-semibold mb-4">Order History</h2>

                        {/* Tabs */}
                        <div className="flex gap-4 mb-6">
                            {['Purchased', 'Requested'].map((label) => (
                                <button
                                    key={label}
                                    onClick={() => setTab(label as 'Purchased' | 'Requested')}
                                    className={`py-2 px-4 rounded ${
                                        tab === label ? 'text-white' : 'text-gray-800 bg-gray-100'
                                    }`}
                                    style={{ backgroundColor: tab === label ? brandNavy : undefined }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Item List */}
                        <div className="space-y-4" ref={listRef}>
                            {pagedItems.map(renderItem)}
                        </div>

                        {/* Pagination Controls */}
                        {pageCount > 1 && (
                            <div className="mt-6 flex justify-center gap-4" style={{ color: brandNavy }}>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border rounded disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="text-sm mt-2">Page {currentPage} of {pageCount}</span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === pageCount}
                                    className="px-4 py-2 border rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OrderHistoryPage;