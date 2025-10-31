import { Scroll, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { ProductsSection } from "./products/ProductSection";

const NO_OF_SLIDES = 4;

export const Overlay = () => {

    const scroll = useScroll();
    const [scrollPos, setScrollPos] = useState(0);
    const [opacityFirstSection, setOpacityFirstSection] = useState();
    const [opacitySecondSection, setOpacitySecondSection] = useState();
    const [opacityThirdSection, setOpacityThirdSection] = useState();

    useFrame(() => {
        setOpacityFirstSection(1 - scroll.range(0, 1 / NO_OF_SLIDES));
        setOpacitySecondSection(scroll.curve(1 / NO_OF_SLIDES, 1 / NO_OF_SLIDES));
        setOpacityThirdSection(scroll.range(2 / NO_OF_SLIDES, 1 / NO_OF_SLIDES));
        setScrollPos(scroll.offset);
    });

    useEffect(() => {
        const root = document.getElementById("root");
        const header = document.querySelector("header");

        // Define gradient stops for each scroll "section"
        let background = "";
        let headerBgClass = "";

        // if (scrollPos < 0.33) {
        //     background = "linear-gradient(135deg,#0d0d0d 0%,#1a1a1a 40%,#2b2b2b 100%)";
        // } else if (scrollPos < 0.66) {
        //     background = "linear-gradient(120deg,#1b1b1b 0%,#3b0d0d 45%,#731010 100%)";
        // } else {
        //     background = "linear-gradient(145deg,#0f2027 0%,#203a43 50%,#2c5364 100%)";
        // }

        if (scrollPos < 0.1) {
            headerBgClass = "bg-transparent";
        } else {
            headerBgClass = "bg-black/60 backdrop-blur-md shadow-lg";
        }

        root.style.transition = "background 1s ease";
        root.style.backgroundImage = background;

        // Update header background classes
        if (header) {
            header.className = `fixed top-0 left-0 w-full z-50 transition-all duration-500 ${headerBgClass}`;
        }
    }, [scrollPos]);

    return (
        <Scroll html>
            <div className="w-[100vw] min-h-screen flex flex-col items-start text-white">

                {/* Slide 1: Hero Section */}
                <section className="flex flex-col justify-center items-center min-h-screen w-[70vw] text-center m-6" style={{ opacity: opacityFirstSection }}>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Unleash Your Story in Ink</h1>
                    <p className="text-lg md:text-2xl mb-6">
                        Bold, creative, and timeless tattoos crafted by passionate artists. Every design tells a story—let us help you tell yours.
                    </p>
                    <button className="bg-red-800 text-white font-semibold px-6 py-3 rounded-full hover:bg-red-900 transition">
                        Book Your Session
                    </button>
                    <p className="mt-6 text-sm md:text-base max-w-xl">
                        From intricate black-and-grey masterpieces to vibrant full-color creations, our studio brings your vision to life. Step into a space where creativity meets precision.
                    </p>
                </section>

                {/* Slide 2: Portfolio Section (Right-Aligned) */}
                <section className="flex flex-col justify-center items-center min-h-screen w-[70vw] text-center m-6" style={{ opacity: opacitySecondSection }}>

                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Art That Speaks for Itself</h2>
                    <p className="text-lg md:text-2xl mb-6">
                        Browse our gallery and see the magic our artists create.
                    </p>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 max-w-full mb-6">
                        <li className="p-4 border rounded-lg shadow-sm">Delicate floral sleeve with rich shading and depth</li>
                        <li className="p-4 border rounded-lg shadow-sm">Bold geometric designs that make a statement</li>
                        <li className="p-4 border rounded-lg shadow-sm">Custom portraits that capture every detail</li>
                        <li className="p-4 border rounded-lg shadow-sm">Vibrant neo-traditional pieces with dynamic color</li>
                    </ul>

                    <button className="bg-red-800 text-white font-semibold px-6 py-3 rounded-full hover:bg-red-900 transition">
                        View Full Gallery
                    </button>
                </section>

                {/* Slide 3: About / Trust Section */}
                <section className="flex flex-col justify-center items-center min-h-screen w-[70vw] text-center m-6" style={{ opacity: opacityThirdSection }}>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Your Safety. Your Style. Our Passion.</h2>
                    <p className="text-lg md:text-2xl mb-6">
                        We blend artistry with professional care to give you the best tattoo experience.
                    </p>
                    <ul className="list-disc list-inside mb-6 text-left max-w-xl space-y-2">
                        <li>Certified and experienced artists with a keen eye for detail.</li>
                        <li>Sterile, safe, and comfortable studio environment.</li>
                        <li>Personalized consultations to ensure every design is uniquely yours.</li>
                    </ul>
                    <button className="bg-red-800 text-white font-semibold px-6 py-3 rounded-full hover:bg-red-900 transition">
                        Schedule a Consultation
                    </button>
                </section>

                {/* Slide 4: Products Section */}
                <ProductsSection />

            </div>
        </Scroll>
    );
};