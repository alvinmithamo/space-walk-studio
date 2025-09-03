import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Move3D, RotateCcw, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

extend({ OrbitControls });

interface Hotspot {
  id: string;
  position: [number, number, number];
  label: string;
  targetPanorama?: string;
}

interface VRViewerProps {
  panoramaUrl?: string;
  hotspots?: Hotspot[];
  onHotspotClick?: (hotspot: Hotspot) => void;
  className?: string;
}

const PanoramaSphere: React.FC<{ 
  texture: string; 
  hotspots: Hotspot[];
  onHotspotClick: (hotspot: Hotspot) => void;
}> = ({ texture, hotspots, onHotspotClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const textureRef = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    if (texture) {
      const loader = new THREE.TextureLoader();
      loader.load(texture, (loadedTexture) => {
        textureRef.current = loadedTexture;
        loadedTexture.wrapS = THREE.RepeatWrapping;
        loadedTexture.repeat.x = -1; // Mirror horizontally for proper panorama display
      });
    }
  }, [texture]);

  return (
    <group>
      <Sphere ref={meshRef} args={[50, 60, 40]} scale={[-1, 1, 1]} position={[0, 0, 0]}>
        <meshBasicMaterial
          map={textureRef.current}
          side={THREE.BackSide}
        />
      </Sphere>
      {hotspots.map((hotspot) => (
        <HotspotMarker 
          key={hotspot.id}
          hotspot={hotspot}
          onClick={() => onHotspotClick(hotspot)}
        />
      ))}
    </group>
  );
};

const HotspotMarker: React.FC<{
  hotspot: Hotspot;
  onClick: () => void;
}> = ({ hotspot, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.scale.setScalar(hovered ? 1.2 : 1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={hotspot.position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshBasicMaterial 
        color={hovered ? "#60A5FA" : "#3B82F6"} 
        transparent 
        opacity={0.8}
      />
    </mesh>
  );
};

const VRScene: React.FC<{
  panoramaUrl: string;
  hotspots: Hotspot[];
  onHotspotClick: (hotspot: Hotspot) => void;
}> = ({ panoramaUrl, hotspots, onHotspotClick }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 0.1);
  }, [camera]);

  return (
    <>
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={0.1}
        maxDistance={1}
        rotateSpeed={-0.5}
      />
      <PanoramaSphere 
        texture={panoramaUrl}
        hotspots={hotspots}
        onHotspotClick={onHotspotClick}
      />
    </>
  );
};

export const VRViewer: React.FC<VRViewerProps> = ({
  panoramaUrl = '/placeholder-panorama.jpg',
  hotspots = [],
  onHotspotClick = () => {},
  className = '',
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      canvasRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const resetView = () => {
    // This would reset the camera position - implementation depends on camera ref
    console.log('Reset view');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`relative bg-background rounded-xl overflow-hidden shadow-card ${className}`}
    >
      <div 
        ref={canvasRef}
        className={`relative ${isFullscreen ? 'h-screen' : 'h-[600px]'} w-full`}
        onMouseEnter={() => setControlsVisible(true)}
        onMouseLeave={() => setControlsVisible(false)}
      >
        <Canvas
          camera={{ 
            fov: 75, 
            near: 0.1, 
            far: 1000,
            position: [0, 0, 0.1]
          }}
          className="bg-background"
        >
          <VRScene
            panoramaUrl={panoramaUrl}
            hotspots={hotspots}
            onHotspotClick={onHotspotClick}
          />
        </Canvas>

        {/* Controls Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: controlsVisible ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 right-4 flex gap-2"
        >
          <Button
            variant="glass"
            size="icon"
            onClick={resetView}
            className="backdrop-blur-md"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="glass"
            size="icon"
            onClick={toggleFullscreen}
            className="backdrop-blur-md"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Hotspot Labels */}
        {hotspots.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: controlsVisible ? 1 : 0, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 left-4 flex flex-wrap gap-2 max-w-md"
          >
            {hotspots.map((hotspot) => (
              <Badge
                key={hotspot.id}
                variant="secondary"
                className="glass-effect cursor-pointer hover:bg-accent/80 transition-smooth"
                onClick={() => onHotspotClick(hotspot)}
              >
                <Eye className="h-3 w-3 mr-1" />
                {hotspot.label}
              </Badge>
            ))}
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: controlsVisible ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-4 right-4 glass-effect px-3 py-2 rounded-md text-sm text-muted-foreground max-w-xs"
        >
          <div className="flex items-center gap-2">
            <Move3D className="h-4 w-4" />
            <span>Click and drag to look around • Scroll to zoom</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VRViewer;