'use client';

import React, { useState, useMemo } from 'react';
import { useParams }   from 'next/navigation';
import {
    Header,
    Footer,
    ProductCard,
    Product,
    PRODUCTS,
} from '../../explore/page';

/* ============================================
   BRAND COLORS
============================================ */
const brandNavy = '#284472';
const brandLightPink = "#fdf5f3";
const brandPink = "#FDEEEA";
const brandLightBrown = "#efe4e1";
const brandBrown = "#675a5e";

// — Filter option arrays (copied from Explore)
const typeOptions      = ['Tops','Bottoms','Outerwear','Dresses','Shoes','Accessories'] as const;
const genderOptions    = ['Mens','Womens','Kids'] as const;
const categoryOptions  = ['For Rent','For Sale'] as const;
const conditionOptions = ['Brand new','Used – Like new','Used – Good','Used – Fair'] as const;
const sizeOptions      = ['XX-Small','X-Small','Small','Medium','Large','X-Large','XX-Large','3X-Large','4X-Large'] as const;
const colorOptions     = ['black','white','red','blue','green','pink'] as const;

export default function ProfilePageByUsername() {
    // 1) grab the URL segment
    const params        = useParams();
    const rawParam      = Array.isArray(params.username) ? params.username[0] : params.username || '';
    const username      = decodeURIComponent(rawParam);

    // 2) placeholder user info
    const userInfo = {
        first_name:  'Jane',
        last_name:   'Doe',
        bio:         'Enthusiastic vintage clothing collector.',
        profile_url: 'https://static.vecteezy.com/system/resources/previews/009/960/522/non_2x/paper-shopping-bags-free-vector.jpg',
        rating:      4.5, // out of 5
    };

    // 3) placeholder listings — **exact** same sample data as Explore
    const items: Product[] = PRODUCTS;

    // 4) filter / sort / pagination state
    const [selTypes,    setTypes]    = useState<string[]>([]);
    const [selGender,   setGender]   = useState<string[]>([]);
    const [selCats,     setCats]     = useState<string[]>([]);
    const [selConds,    setConds]    = useState<string[]>([]);
    const [selSizes,    setSizes]    = useState<string[]>([]);
    const [selColors,   setColors]   = useState<string[]>([]);
    const [priceRange,  setPriceRange] = useState<[number,number]>([0,500]);
    const [sort,        setSort]     = useState<'Most Popular'|'Price: Low to High'|'Price: High to Low'>('Most Popular');
    const [page,        setPage]     = useState(1);
    const perPage                     = 9;

    const toggle = (val:string, state:string[], setState:React.Dispatch<React.SetStateAction<string[]>>) => {
        setState(state.includes(val) ? state.filter(x=>x!==val) : [...state,val]);
        setPage(1);
    };

    // 5) apply filters + sort
    const filtered = useMemo(() => {
        return items
            .filter(p => {
                if (selTypes.length    && !selTypes.includes(p.type))      return false;
                if (selGender.length   && !selGender.includes(p.audience)) return false;
                if (selCats.length) {
                    const rentMatch = selCats.includes('For Rent') && p.forRent;
                    const saleMatch = selCats.includes('For Sale') && p.forSale;
                    if (!rentMatch && !saleMatch) return false;
                }
                if (selConds.length    && !selConds.includes(p.condition))   return false;
                if (selSizes.length    && !p.sizes.some(s=>selSizes.includes(s)))   return false;
                if (selColors.length   && !p.colors.some(c=>selColors.includes(c))) return false;
                if (p.price < priceRange[0] || p.price > priceRange[1])     return false;
                return true;
            })
            .sort((a,b) => {
                if (sort === 'Price: Low to High') return a.price - b.price;
                if (sort === 'Price: High to Low') return b.price - a.price;
                // Most Popular → newest first
                return Number(b.id) - Number(a.id);
            });
    }, [items, selTypes, selGender, selCats, selConds, selSizes, selColors, priceRange, sort]);

    // 6) pagination
    const pages     = Math.ceil(filtered.length / perPage);
    const pageItems = filtered.slice((page - 1)*perPage, page*perPage);

    return (
        <div className="profile-page min-h-screen flex flex-col bg-white">
            {/* Hide lister avatar/name pill on ProductCard */}
            <style jsx global>{`
                  .profile-page :global(.absolute.top-2.left-2) {
                  display: none !important;
                  }
            `}</style>
            <Header />

            {/* — User Info */}
            <div className="container mx-auto px-4 mt-16 mb-8">
                <div className="flex items-center justify-center space-x-12">
                {/* avatar + name */}
                    <div className="flex items-center">
                        <img
                            src={userInfo.profile_url}
                            alt="avatar"
                            className="w-24 h-24 rounded-full mr-6 border-4 border-white shadow-lg"
                        />
                        <div>
                            <h2 className="text-3xl font-semibold text-gray-800">
                                {userInfo.first_name} {userInfo.last_name}
                            </h2>
                            <div className="flex items-center text-sm text-gray-600 mt-2">
                                <span className="mr-2">Rating:</span>
                                <div className="flex gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563
                                               0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204
                                               3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0
                                               0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982
                                               20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0
                                               0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518
                                               -.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563
                                               0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204
                                               3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0
                                               0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982
                                               20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0
                                               0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518
                                               -.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563
                                               0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204
                                               3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0
                                               0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982
                                               20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0
                                               0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518
                                               -.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563
                                               0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204
                                               3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0
                                               0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982
                                               20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0
                                               0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518
                                               -.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563
                                               0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204
                                               3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0
                                               0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982
                                               20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0
                                               0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518
                                               -.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                    <span className="ml-2">{userInfo.rating.toFixed(1)} / 5</span>
                                </div>
                            </div>


                            <p className="mt-2 text-gray-600">{userInfo.bio}</p>
                        </div>
                    </div>

                    {/* move button in closer by adding ml-6 */}
                    <button
                        style={{ backgroundColor: brandNavy, color: 'white' }}
                        className="ml-6 px-4 py-2 rounded"
                    >
                        Follow
                    </button>
                </div>
            </div>

            {/* — Filters + Listings Grid (layout from Explore) */}
            <div className="container mx-auto py-6 px-4 flex-1 flex gap-6">
                {/* Sidebar */}
                <aside className="w-64 space-y-6 text-black sticky top-20">
                    {/* Sort */}
                    <div>
                        <h3 className="font-semibold mb-2">Sort by</h3>
                        <select
                            value={sort}
                            onChange={e => { setSort(e.target.value as any); setPage(1); }}
                            className="w-full border p-2"
                        >
                            <option>Most Popular</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>

                    {/* Type */}
                    <div>
                        <h3 className="font-semibold mb-2">Type</h3>
                        {typeOptions.map(opt=>(
                            <label key={opt} className="block">
                                <input
                                    type="checkbox"
                                    checked={selTypes.includes(opt)}
                                    onChange={()=>toggle(opt,selTypes,setTypes)}
                                    className="mr-2"
                                />
                                {opt}
                            </label>
                        ))}
                    </div>

                    {/* Audience */}
                    <div>
                        <h3 className="font-semibold mb-2">Audience</h3>
                        {genderOptions.map(opt=>(
                            <label key={opt} className="block">
                                <input
                                    type="checkbox"
                                    checked={selGender.includes(opt)}
                                    onChange={()=>toggle(opt,selGender,setGender)}
                                    className="mr-2"
                                />
                                {opt}
                            </label>
                        ))}
                    </div>

                    {/* Category */}
                    <div>
                        <h3 className="font-semibold mb-2">Category</h3>
                        {categoryOptions.map(opt=>(
                            <label key={opt} className="block">
                                <input
                                    type="checkbox"
                                    checked={selCats.includes(opt)}
                                    onChange={()=>toggle(opt,selCats,setCats)}
                                    className="mr-2"
                                />
                                {opt}
                            </label>
                        ))}
                    </div>

                    {/* Condition */}
                    <div>
                        <h3 className="font-semibold mb-2">Condition</h3>
                        {conditionOptions.map(opt=>(
                            <label key={opt} className="block">
                                <input
                                    type="checkbox"
                                    checked={selConds.includes(opt)}
                                    onChange={()=>toggle(opt,selConds,setConds)}
                                    className="mr-2"
                                />
                                {opt}
                            </label>
                        ))}
                    </div>

                    {/* Size */}
                    <div>
                        <h3 className="font-semibold mb-2">Size</h3>
                        {sizeOptions.map(opt=>(
                            <label key={opt} className="block">
                                <input
                                    type="checkbox"
                                    checked={selSizes.includes(opt)}
                                    onChange={()=>toggle(opt,selSizes,setSizes)}
                                    className="mr-2"
                                />
                                {opt}
                            </label>
                        ))}
                    </div>

                    {/* Color */}
                    <div>
                        <h3 className="font-semibold mb-2">Color</h3>
                        {colorOptions.map(opt=>(
                            <label key={opt} className="block">
                                <input
                                    type="checkbox"
                                    checked={selColors.includes(opt)}
                                    onChange={()=>toggle(opt,selColors,setColors)}
                                    className="mr-2"
                                />
                                {opt}
                            </label>
                        ))}
                    </div>

                    {/* Price */}
                    <div>
                        <h3 className="font-semibold mb-2">Price</h3>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={priceRange[0]}
                                onChange={e=>{ setPriceRange([+e.target.value, priceRange[1]]); setPage(1); }}
                                className="w-1/2 border p-1"
                                min={0}
                            />
                            <span>–</span>
                            <input
                                type="number"
                                value={priceRange[1]}
                                onChange={e=>{ setPriceRange([priceRange[0], +e.target.value]); setPage(1); }}
                                className="w-1/2 border p-1"
                                min={0}
                            />
                        </div>
                    </div>
                </aside>

                {/* Listings Grid */}
                <main className="flex-1">
                    <h2 className="text-2xl font-semibold mb-4">Shop Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pageItems.map(p => {
                            const withoutUser: Product = {
                                ...p,
                                lister: {
                                    avatarUrl: '',
                                    display:   '',
                                    username:  '',
                                }
                            };
                            return <ProductCard key={p.id} product={withoutUser} />;
                        })}
                    </div>

                    {/* Pagination */}
                    {pages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8" style={{ color: brandNavy }}>
                            <button
                                onClick={()=>setPage(x=>Math.max(1,x-1))}
                                disabled={page === 1}
                                className="px-3 py-1 border disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {[...Array(pages)].map((_,i) => (
                                <button
                                    key={i}
                                    onClick={()=>setPage(i+1)}
                                    className={`px-3 py-1 border ${page===i+1?'bg-gray-200':''}`}
                                >
                                    {i+1}
                                </button>
                            ))}
                            <button
                                onClick={()=>setPage(x=>Math.min(pages,x+1))}
                                disabled={page === pages}
                                className="px-3 py-1 border disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
}
