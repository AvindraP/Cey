import { OrbitControls, ScrollControls } from "@react-three/drei";
import { Model } from "./Model";
import { Overlay } from "./Overlay";

export const Experience = () => {
    return (
        <>
            <directionalLight intensity={3} position={[5,5,6]} castShadow />
            <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
            <ScrollControls pages={4} damping={0.50}>
                <Overlay />
                <Model position={[0.5,-0.1,0]} />
            </ScrollControls>
        </>
    );
};