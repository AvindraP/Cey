import { useState } from "react";
import { OrbitControls, ScrollControls } from "@react-three/drei";
import { Model } from "./Model";
import { Overlay } from "./Overlay";

export const Experience = ({ onScrollToSection }) => {
    const [currentIndex, setCurrentIndex] = useState(-1);

    return (
        <>
            <directionalLight intensity={1} position={[-0.3,0.3,0.5]} castShadow />
            <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
            <ScrollControls damping={0.50}>
                <Overlay onScrollToSection={onScrollToSection} onActiveIndexChange={setCurrentIndex} />
                <Model position={[0.5,-1.5,0]} activeIndex={currentIndex} />
            </ScrollControls>
        </>
    );
};