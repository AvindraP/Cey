import { useState } from "react";
import { OrbitControls, ScrollControls } from "@react-three/drei";
import { Model } from "./Model";
import { Overlay } from "./Overlay";

export const Experience = ({ onScrollToSection }) => {
    const [currentIndex, setCurrentIndex] = useState(-1);

    return (
        <>
            <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
            <ScrollControls damping={0.50}>
                <Overlay onScrollToSection={onScrollToSection} onActiveIndexChange={setCurrentIndex} />
                <Model activeIndex={currentIndex} />
            </ScrollControls>
        </>
    );
};