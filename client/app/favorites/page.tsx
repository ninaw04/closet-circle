'use client';

import React, { useState, useEffect } from 'react';
import {
    Header,
    ProductCard,
    Footer,
    Product,
} from '../explore/page';

/* ============================================
   BRAND COLORS
============================================ */
const brandNavy = '#284472';
const brandLightPink = "#fdf5f3";
const brandPink = "#FDEEEA";
const brandLightBrown = "#efe4e1";
const brandBrown = "#675a5e";

const FavoritesPage: React.FC = () => {
    // sample placeholder product to test UI (delete after backend implementation)
    const sampleProduct: Product = {
        id: 999,
        title: 'Sample Placeholder Item',
        price: 0,
        forSale: false,
        forRent: false,
        type: 'Accessories',
        audience: 'Womens',
        colors: [],
        sizes: [],
        condition: 'Brand new',
        description: 'This is a placeholder to preview the Favorites UI.',
        images: [],
        lister: {
            display: 'Demo User',
            username: 'demo-user',
            avatarUrl: 'https://via.placeholder.com/32',
        },
    };

    const [favoriteItems, setFavoriteItems] = useState<Product[]>([
        sampleProduct,
    ]);

    const handleRemove = (id: number) =>
        setFavoriteItems((prev) => prev.filter((p) => p.id !== id));

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <div className="container mx-auto py-6 px-4 flex-1">
                <h1 style={{ color: brandBrown }} className="text-4xl font-medium mb-8">
                    Wishlist
                </h1>

                {favoriteItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favoriteItems.map((p) => (
                            <div key={p.id} className="space-y-2">
                                <ProductCard product={p} initialFav />
                                <button
                                    onClick={() => handleRemove(p.id)}
                                    className="hover:underline text-sm" style={{ color: brandBrown }}
                                >
                                    Remove from favorites
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">
                        You haven’t added any favorites yet.
                    </p>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default FavoritesPage;