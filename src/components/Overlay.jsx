import { Scroll, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { MathUtils } from "three";

const NO_OF_SLIDES = 6.5;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Product Card Component
const ProductCard = ({ product, images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!isHovered || !images || images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 800);

        return () => clearInterval(interval);
    }, [isHovered, images]);

    useEffect(() => {
        if (!isHovered) {
            setCurrentImageIndex(0);
        }
    }, [isHovered]);

    const displayPrice = product.display_price || null;
    const discountedPrice = product.base_price || '0.00';

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-all duration-300 group">
            <div
                className="relative h-40 lg:h-52 w-40 lg:w-52 bg-zinc-950"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {images && images.length > 0 ? (
                    <img
                        src={`${API_BASE_URL}/images/${images[currentImageIndex]}`}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="flex flex-col items-center p-5 w-40 lg:w-52">
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-zinc-400 mb-2 line-clamp-2 leading-snug min-h-[2.8em] text-center">{product.description}</p>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-white">${discountedPrice}</span>
                        <span className="text-sm text-zinc-500 line-through">{displayPrice ? `$${displayPrice}` : ''}</span>
                    </div>
                </div>
                <button className="bg-white text-black px-4 py-2 text-sm font-semibold rounded hover:bg-zinc-200 transition-colors">
                    Buy Now
                </button>
            </div>
        </div>
    );
};

// Products Section Component
const ProductsSection = ({ getSectionProgress }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/products/listproducts`);
                const data = await response.json();
                setProducts(data.slice(0, 4));
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const p = getSectionProgress(3);
    return (
        <section
            className="flex flex-col justify-center items-start min-h-screen overflow-y-hidden w-full overflow-x-hidden lg:w-[70vw] px-6 m-0 text-center transition-all duration-500"
            style={{
                opacity: p,
                transform: `translateY(${(1 - p) * 30}px)`,
            }}
            id="products"
        >
            <div className="max-w-7xl w-full mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white text-center">Our Products</h2>
                <p className="text-lg md:text-xl text-zinc-400 mb-12 text-center max-w-2xl mx-auto">
                    Premium tattoo supplies, inks, and aftercare essentials trusted by professionals
                </p>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-lg h-96 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12 justify-items-center">
                        {products.map((item) => (
                            <ProductCard key={item.product.id} product={item.product} images={item.images} />
                        ))}
                    </div>
                )}

                <div className="text-center">
                    <a
                        href="/products"
                        className="inline-block bg-white text-black px-8 py-3 font-semibold rounded hover:bg-zinc-200 transition-colors"
                    >
                        View All Products →
                    </a>
                </div>
            </div>
        </section>
    );
};

export const Overlay = ({ onScrollToSection }) => {
    const scroll = useScroll();
    const [scrollPos, setScrollPos] = useState(0);
    const [introProgress, setIntroProgress] = useState(0);
    const scrollRef = useRef(0);

    useFrame(() => {
        scrollRef.current = MathUtils.lerp(scrollRef.current, scroll.offset, 0.1);
    });

    useEffect(() => {
        let frame;
        let start = null;
        const duration = 1500; // 1.5 s fade-in

        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = easeOutCubic(Math.min(elapsed / duration, 1));
            setIntroProgress(progress);
            if (progress < 1) frame = requestAnimationFrame(animate);
        };

        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);


    useEffect(() => {
        const handle = setInterval(() => {
            setScrollPos(scrollRef.current);
        }, 100); // update ~10 times per second
        return () => clearInterval(handle);
    }, []);

    const scrollToSection = (sectionIndex) => {
        const target = sectionIndex / (NO_OF_SLIDES);
        if (scroll.el) {
            scroll.el.scrollTo({
                top: target * scroll.el.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        if (scroll && onScrollToSection) {
            onScrollToSection(() => scrollToSection);
        }
    }, [scroll, onScrollToSection]);

    useEffect(() => {
        const header = document.querySelector("header");
        const footer = document.querySelector("footer");

        let headerBgClass = "";

        if (scrollPos < 0.025) {
            headerBgClass = "bg-transparent";
        } else {
            headerBgClass = "bg-black/80 backdrop-blur-md";
        }

        if (header) {
            header.className = `fixed top-0 left-0 w-full z-50 transition-all duration-500 ${headerBgClass}`;
        }

        if (footer) {
            footer.className = (scrollPos > 0.99) ? `fixed bottom-0 left-0 w-full py-4 text-center border-t border-zinc-800 bg-black z-50 transition-all` : `hidden`;
        }
    }, [scrollPos]);

    // Example: define heights of all sections
    const sectionHeights = [1, 1, 1, 1, 1, 1.5]; // last section taller
    const totalHeight = sectionHeights.reduce((a, b) => a + b, 0);

    const getSectionProgress = (index) => {
        const sectionSize = sectionHeights[index] / totalHeight;

        // Calculate start position of this section
        const start = sectionHeights
            .slice(0, index)
            .reduce((sum, h) => sum + h / totalHeight, 0);

        const fadeOverlap = sectionSize * 0.15; // can still scale fade
        const end = start + sectionSize + fadeOverlap;

        const progress = (scrollPos - start) / (end - start);
        const clamped = MathUtils.clamp(progress, 0, 1);

        // Fade zones
        let opacity = 0;
        const fadeInEnd = 0.25;
        const fadeOutStart = 0.75;

        if (clamped < fadeInEnd) {
            opacity = clamped / fadeInEnd;
        } else if (clamped < fadeOutStart) {
            opacity = 1;
        } else {
            opacity = 1 - (clamped - fadeOutStart) / (1 - fadeOutStart);
        }

        opacity = MathUtils.clamp(opacity, 0, 1);

        // Blend intro animation for section 0
        if (index === 0) {
            return Math.max(opacity, introProgress);
        }

        return opacity;
    };


    return (
        <Scroll html>
            <div className="w-full flex flex-col text-white min-h-[120vh] pb-40 pt-20">
                <div className="w-full flex flex-col text-white">

                    {/* Slide 0: Hero with INKVERSE Logo */}
                    {(() => {
                        const p = getSectionProgress(0);
                        return (
                            <section
                                className="flex flex-col justify-center items-center min-h-screen overflow-y-hidden w-full overflow-x-hidden lg:w-[70vw] px-6 m-0 text-center transition-all duration-500"
                                style={{
                                    opacity: p,
                                    transform: `translateY(${(1 - p) * 30}px)`,
                                }}
                                id="hero-logo"
                            >
                                <div className="max-w-4xl relative">
                                    {/* Large INKVERSE Text */}
                                    <h1 className="text-7xl md:text-9xl font-bold mb-8 tracking-tight text-white">
                                        INKVERSE
                                    </h1>

                                    {/* Placeholder for cutout image - replace src with your actual image */}
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-100 h-100 md:w-200 md:h-200">
                                        <img
                                            src="/images/cutout-image.png"
                                            className="w-full h-full object-contain drop-shadow-2xl"
                                        />
                                    </div>

                                    <p className="text-xl md:text-2xl text-zinc-300 font-light mt-8">
                                        Where Art Meets Skin
                                    </p>
                                </div>
                            </section>
                        );
                    })()}

                    {/* Slide 1: Original Hero Section */}
                    {(() => {
                        const p = getSectionProgress(1);
                        return (
                            <section
                                className="flex flex-col justify-center items-start min-h-screen overflow-y-hidden w-[70vw] px-6 m-0 text-center transition-all duration-500"
                                style={{
                                    opacity: p,
                                    transform: `translateY(${(1 - p) * 30}px)`,
                                }}
                                id="hero"
                            >
                                <div className="max-w-4xl">
                                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-6 tracking-tight">
                                        Ink That Tells<br />Your Story
                                    </h1>
                                    <p className="text-md md:text-lg text-zinc-300 [text-shadow:2px_2px_3px_rgba(0,0,0,1)] mb-8 leading-relaxed max-w-3xl mx-auto">
                                        Bold lines. Real art. Personal meaning. At <span className="font-semibold text-white">INKVERSE</span>, we craft tattoos that speak louder than words – from fine-line minimal pieces to full custom designs.
                                    </p>
                                    <p className="text-base md:text-md text-zinc-400 [text-shadow:2px_2px_3px_rgba(0,0,0,1)] mb-10 max-w-2xl mx-auto">
                                        Explore our online store for premium tattoo supplies, aftercare essentials, and artist-approved gear. Book your session or shop your essentials – your next masterpiece starts here.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <button className="bg-white text-black font-semibold px-3 py-1.5 rounded hover:bg-zinc-200 transition-colors">
                                            Book Your Session
                                        </button>
                                        <button className="border border-white text-white font-semibold px-3 py-1.5 rounded hover:bg-white hover:text-black transition-all">
                                            Shop Essentials
                                        </button>
                                    </div>
                                </div>
                            </section>
                        );
                    })()}

                    {/* Slide 2: About Us */}
                    {(() => {
                        const p = getSectionProgress(2);
                        return (
                            <section
                                className="flex flex-col justify-center items-start min-h-screen overflow-y-hidden w-[70vw] px-6 m-0 text-center transition-all duration-500"
                                style={{
                                    opacity: p,
                                    transform: `translateY(${(1 - p) * 30}px)`,
                                }}
                                id="about"
                            >
                                <div className="max-w-4xl">
                                    <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-6 tracking-tight">
                                        Where Art<br />Meets Skin
                                    </h2>
                                    <p className="text-md md:text-lg text-zinc-300 [text-shadow:2px_2px_3px_rgba(0,0,0,1)] mb-6 leading-relaxed">
                                        At <span className="font-semibold text-white">INKVERSE</span>, every tattoo is a story – designed, detailed, and delivered with precision. Our artists combine creativity with craftsmanship to make every piece personal and unforgettable.
                                    </p>
                                    <p className="text-base md:text-md text-zinc-400 [text-shadow:2px_2px_3px_rgba(0,0,0,1)] mb-8">
                                        We also bring you a curated range of tattoo supplies, inks, and care products trusted by professionals and enthusiasts alike.
                                    </p>
                                    <p className="text-base md:text-md text-zinc-300 [text-shadow:2px_2px_3px_rgba(0,0,0,1)] font-medium">
                                        Based in <span className="text-white">Brooklyn, NY</span>, INKVERSE is more than a tattoo studio – it's a modern space where art lives forever.
                                    </p>
                                </div>
                            </section>
                        );
                    })()}

                    {/* Slide 3: Products Section */}
                    <ProductsSection getSectionProgress={getSectionProgress} />

                    {/* Slide 4: Free Delivery Section */}
                    {(() => {
                        const p = getSectionProgress(4);
                        return (
                            <section
                                className="flex flex-col justify-center items-center min-h-screen overflow-y-hidden w-[70vw] px-6 m-0 text-center transition-all duration-500"
                                style={{
                                    opacity: p,
                                    transform: `translateY(${(1 - p) * 30}px)`,
                                }}
                                id="delivery"
                            >
                                <div className="max-w-2xl">
                                    <div className="mb-8 flex justify-center">
                                        <div className="w-32 h-32 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
                                            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Free Delivery</h2>
                                    <p className="text-lg md:text-xl text-zinc-400 mb-6 leading-relaxed">
                                        We offer complimentary shipping on all orders over $75. Your premium tattoo supplies and aftercare products delivered straight to your door.
                                    </p>
                                    <p className="text-base md:text-lg text-zinc-500">
                                        Fast, reliable, and secure shipping across the continental US. Track your order every step of the way.
                                    </p>
                                </div>
                            </section>
                        );
                    })()}

                    {/* Slide 5: Contact Us */}
                    {(() => {
                        const p = getSectionProgress(5);
                        return (
                            <section
                                className="flex flex-col justify-center items-center min-h-screen overflow-y-hidden w-[70vw] px-6 m-0 mb-50 text-center transition-all duration-500"
                                style={{
                                    opacity: p,
                                    transform: `translateY(${(1 - p) * 30}px)`,
                                }}
                                id="contact"
                            >
                                <div className="max-w-4xl">
                                    <h2 className="text-xl md:text-3xl lg:text-3xl font-bold mb-6 tracking-tight">
                                        Let's Connect
                                    </h2>
                                    <p className="text-base md:text-md text-zinc-400 mb-12">
                                        Book your appointment or send us your idea – we'll help bring it to life.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 text-left mb-12">
                                        <div className="border border-zinc-800 rounded-lg p-3 sm:p-6 hover:border-zinc-600 transition-colors">
                                            <div className="flex text-xl mb-2">📍
                                                <h3 className="text-md font-semibold mb-2 ml-2">Visit Us</h3>
                                            </div>
                                            <p className="text-zinc-400">245 Wythe Ave<br />Brooklyn, NY 11249</p>
                                        </div>

                                        <div className="border border-zinc-800 rounded-lg p-3 sm:p-6 hover:border-zinc-600 transition-colors">
                                            <div className="flex text-xl mb-2">📞
                                                <h3 className="text-md font-semibold mb-2 ml-2">Call</h3>
                                            </div>
                                            <p className="text-zinc-400">(718) 555-9034</p>
                                        </div>

                                        <div className="border border-zinc-800 rounded-lg p-3 sm:p-6 hover:border-zinc-600 transition-colors">
                                            <div className="flex text-xl mb-2">✉️
                                                <h3 className="text-md font-semibold mb-2 ml-2">Email</h3>
                                            </div>
                                            <p className="text-zinc-400">hello@inkversestudio.com</p>
                                        </div>

                                        <div className="border border-zinc-800 rounded-lg p-3 sm:p-6 hover:border-zinc-600 transition-colors">
                                            <div className="flex text-xl mb-2">🕒
                                                <h3 className="text-md font-semibold mb-2 ml-2">Hours</h3>
                                            </div>
                                            <p className="text-zinc-400">Mon–Sat: 11 AM – 8 PM<br />Sun: Closed</p>
                                        </div>
                                    </div>

                                    <button className="bg-white text-black font-semibold px-5 py-3 rounded hover:bg-zinc-200 transition-colors text-lg mb-20">
                                        Book Appointment
                                    </button>
                                </div>
                            </section>
                        );
                    })()}

                </div>
            </div>
        </Scroll>
    );
};