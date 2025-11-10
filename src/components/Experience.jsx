import { OrbitControls, ScrollControls } from "@react-three/drei";
import { Model } from "./Model";
import { Overlay } from "./Overlay";

export const Experience = ({ onScrollToSection }) => {
    return (
        <>
            <directionalLight intensity={3} position={[5,5,6]} castShadow />
            <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
            <ScrollControls pages={6.75} damping={0.50}>
                <Overlay onScrollToSection={onScrollToSection} />
                <Model position={[0.5,-0.1,0]} />
            </ScrollControls>
        </>
    );
};