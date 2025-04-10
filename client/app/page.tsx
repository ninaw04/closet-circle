'use client';
import React, {useState, useEffect, JSX} from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
const brandNavy = '#284472';
const brandLightPink = "#fdf5f3";
const brandPink= "#FDEEEA";
const brandLightBrown= "#efe4e1";
const brandBrown= "#675a5e";


// Header
const Header: React.FC = () => {
  const { user } = useUser();

  return (
      <header style={{ backgroundColor: brandNavy }} className="flex justify-between items-center p-5 drop-shadow-sm" >
        <nav className="flex gap-5 items-center">
          <Link href="/about" className="text-xl font-semibold tracking-wide text-white p-2">
            About
          </Link>
          <Link href="/explore" className="text-xl font-semibold tracking-wide text-white p-2">
            Explore
          </Link>
        </nav>
        <div className="flex gap-5 items-center">
          {!user ? (
              <div className="flex gap-2.5">
                <Link
                    href="/api/auth/login?returnTo=/profile"
                    style={{ backgroundColor: brandLightPink, color: brandNavy}}  className="px-7 py-3 text-xl font-semibold tracking-wide text-center"
                >
                  Log In
                </Link>
                <Link
                    href="/api/auth/login?returnTo=/profile"
                    style={{ backgroundColor: brandLightPink, color: brandBrown }}  className="px-7 py-3 text-xl font-semibold tracking-wide text-center"
                >
                  Sign Up
                </Link>
              </div>
          ) : (
              <div className="flex gap-2.5">
                <Link href="/profile" className="px-5 py-2 text-white font-semibold hover:underline">
                  Profile
                </Link>
                <Link href="/api/auth/logout" className="px-5 py-2 text-white font-semibold hover:underline">
                  Logout
                </Link>
              </div>
          )}
        </div>
      </header>
  );
};

// Hero
const HeroSection: React.FC = () => (
    <section
        style={{ backgroundColor: brandLightPink }}
        className="flex flex-col items-start p-10 bg-opacity-50"
    >
        <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/cbcbc59fadb92cbfa94f7a46414d883263e97dc4"
            alt="Hero"
            className="w-[1400px] max-w-full h-auto mb-[40px] self-center"
        />
        <div className="max-w-[1300px]" style={{ marginLeft: '200px' }}>
            <h1
                style={{ color: brandBrown }}
                className="mb-10 text-4xl tracking-wide leading-15 text-left"
            >
                A convenient new way to buy, borrow, and sell clothes within your community and friends.
            </h1>
            <Link
                href="/explore"
                style={{ backgroundColor: brandNavy }}
                className="flex gap-2.5 items-center px-4 py-5 text-xl font-medium text-white w-fit"
            >
                Explore Products
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                </svg>
            </Link>
        </div>
    </section>
);



// Features
const FeatureItem: React.FC<{ title: string; description: string; icon: JSX.Element }> = ({title, description, icon,}) => (
    <article className="flex items-start gap-4 text-left">
        <div className="mt-1 text-brandBrown">{icon}</div>
        <div>
            <h2 className="mb-1 text-2xl font-semibold text-zinc-800">{title}</h2>
            <p style={{ color: brandBrown }} className="text-base">
                {description}
            </p>
        </div>
    </article>
);


const FeaturesSection: React.FC = () => (
    <section
        style={{ backgroundColor: brandPink }}
        className="py-10 flex justify-center items-start gap-55 max-md:flex-col">
        <FeatureItem
            title="Buy"
            description="Purchase secondhand items"
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     strokeWidth={1.5} stroke={brandBrown} className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993
             1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125
             1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1
             5.513 7.5h12.974c.576 0 1.059.435 1.119
             1.007ZM8.625 10.5a.375.375 0 1 1-.75
             0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75
             0 .375.375 0 0 1 .75 0Z"
                    />
                </svg>
            }
        />
        <FeatureItem
            title="Borrow"
            description="Lend items out to friends"
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     strokeWidth={1.5} stroke={brandBrown} className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985
             19.644v-4.992m0 0h4.992m-4.993 0
             3.181 3.183a8.25 8.25 0 0 0
             13.803-3.7M4.031 9.865a8.25 8.25
             0 0 1 13.803-3.7l3.181
             3.182m0-4.991v4.99"
                    />
                </svg>
            }
        />
        <FeatureItem
            title="Sell"
            description="List items to be sold"
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     strokeWidth={1.5} stroke={brandBrown} className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M9.568 3H5.25A2.25 2.25 0 0 0 3
             5.25v4.318c0 .597.237 1.17.659
             1.591l9.581 9.581c.699.699
             1.78.872 2.607.33a18.095 18.095
             0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16
             3.66A2.25 2.25 0 0 0 9.568 3Z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                </svg>
            }
        />
    </section>
);



// CTA
const RegistrationCTA: React.FC = () => (
    <section className="flex justify-center items-center p-5">
      <p style={{ color: brandNavy }} className="mr-5 text-2xl leading-6">
        Register now to add your friends and start listing your items.
      </p>
      <Link
          href="/api/auth/login?screen_hint=signup"
          className="px-5 py-2.5 text-xl font-semibold tracking-wide" style={{ backgroundColor: brandNavy }}
      >
        Register
      </Link>
    </section>
);

// Product Showcase
const ProductShowcase: React.FC = () => (
    <section className="grid grid-cols-3 gap-5 p-8 max-md:grid-cols-2 max-sm:grid-cols-1">
        {[
            {
                src: 'https://cdn.builder.io/api/v1/image/assets/TEMP/cbedef64488709f872118a3e1474e860e98284e0',
                alt: 'Shop Women',
            },
            {
                src: 'https://cdn.builder.io/api/v1/image/assets/TEMP/970d6bada2549fae2f02e22d0da0c759bfd691bb',
                alt: 'Shop Men',
            },
            {
                src: 'https://cdn.builder.io/api/v1/image/assets/TEMP/ab67ce25c2ee816ba98839f705a997a4a2e753ca',
                alt: 'Shop Accessories',
            },
        ].map(({ src, alt }, index) => (
            <div key={index} className="relative w-full h-[532px] overflow-hidden rounded-lg">
                <img src={src} alt={alt} className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4">
                    <h2 className="text-white text-xl font-semibold drop-shadow-md">{alt}</h2>
                </div>
            </div>
        ))}
    </section>
);



// Trending Items
const ProductCard: React.FC<{ image: string; title: string; buyPrice: string }> = ({image, title, buyPrice,}) => (
    <article className="flex flex-col">
      <img src={image} alt={title} className="w-full h-[298px] object-cover rounded-[20px] mb-4" />
      <h3 className="mb-4 text-xl font-medium text-black">{title}</h3>
      <div className="flex gap-2.5">
        <button style={{ backgroundColor: brandBrown }} className="px-5 py-2.5 text-xl font-semibold tracking-wide text-white">
          Buy for {buyPrice}
        </button>
        <button style={{ color: brandBrown }} className="px-5 py-2.5 text-xl font-semibold tracking-wide border-2 border-zinc-600 text-zinc-600">
          Rent
        </button>
      </div>
    </article>
);

const TrendingItems: React.FC = () => {
  const products = [
    {
      id: 1,
      image:
          'https://cdn.builder.io/api/v1/image/assets/TEMP/a597e91d65960d1b00fc109a2fefe3b003a97311',
      title: 'Gradient Graphic T-shirt',
      buyPrice: '$10',
    },
  ];

  return (
      <section className="mb-10 text-center">
        <h2 className="mb-10 text-4xl text-black">Trending Items</h2>
        <div className="grid grid-cols-4 gap-5 p-5 max-md:grid-cols-2 max-sm:grid-cols-1">
          {products.map((product) => (
              <ProductCard key={product.id} {...product} />
          ))}
        </div>
        <button className="px-14 py-4 mx-auto mt-10 text-base font-medium text-black border border-black border-opacity-10 rounded-[62px]">
          View All
        </button>
      </section>
  );
};

// Purpose
const PurposeSection: React.FC = () => (
    <section style={{ backgroundColor: brandLightBrown }} className="px-0 pt-24 pb-44 text-center">
      <h2 style={{ color: brandBrown }} className="mb-12 text-4xl font-medium leading-8">Our Purpose</h2>
      <p style={{ color: brandBrown }} className="mx-auto text-xl leading-7 max-w-[1075px] pb-5">
        Fast fashion has transformed the way people consume clothing, but at an enormous environmental cost. Each year, the fashion industry generates 92 million tons of textile waste, much of which ends up in landfills or is incinerated, releasing harmful emissions. Additionally, synthetic fabrics shed microplastics, contributing to 35% of ocean plastic pollution. With clothing production doubling in the past 15 years but garments being worn 40% less, the need for sustainable fashion solutions has never been more urgent.
      </p>
      <p style={{ color: brandBrown }} className="mx-auto text-xl leading-7 max-w-[1075px] pb-5">
        Closet Circle is a platform designed to extend the life cycle of clothing and combat fast fashion’s wasteful practices. By enabling users to borrow, sell, and rent clothing within their communities, we make it easier to embrace reuse over disposal. Our platform fosters a circular economy, reducing the demand for new clothing production while giving pre-loved pieces a second life.
      </p>
      <p style={{ color: brandBrown }} className="mx-auto text-xl leading-7 max-w-[1075px]" >
        Through Closet Circle, we empower individuals to shop consciously, share responsibly, and reduce textile waste, all while staying stylish. Fashion should be about expression, not excess—and with Closet Circle, we make sustainability a shared effort, one outfit at a time.
      </p>
    </section>
);

// Footer
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
                className="flex-1 text-sm leading-5 text-gray-200 bg-transparent"
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
            </a>
            .
          </p>
        </div>
        <button style={{ backgroundColor: brandLightPink,color: brandNavy }} type="submit" className="px-5 py-3 text-base leading-5 bg-white w-fit">
          Subscribe
        </button>
      </form>
  );
};

const Footer: React.FC = () => (
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

// Final export
export default function Home() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      sessionStorage.removeItem('newuser_complete');
    }
  }, [user]);

  return (
      <main className="min-h-screen flex flex-col bg-white">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <RegistrationCTA />
        <ProductShowcase />
        <TrendingItems />
        <PurposeSection />
        <Footer />
      </main>
  );
}
