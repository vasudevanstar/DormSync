import React from 'react';
import { motion } from 'framer-motion';
import Particles from "react-tsparticles";
import type { Engine, IOptions, RecursivePartial } from "tsparticles-engine";

interface LandingPageProps {
  onEnter: () => void;
  particlesInit: (engine: Engine) => Promise<void>;
}

const landingParticlesOptions: RecursivePartial<IOptions> = {
    background: {
      color: {
        value: "#000000",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: false,
        },
        onHover: {
          enable: true,
          mode: "grab",
        },
        resize: true,
      },
      modes: {
        grab: {
            distance: 200,
            links: {
                opacity: 0.5
            }
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff",
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.1,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "out",
        },
        random: false,
        speed: 0.5,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80,
      },
      opacity: {
        value: 0.2,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
};

const LandingPage: React.FC<LandingPageProps> = ({ onEnter, particlesInit }) => {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen cursor-pointer bg-dark-bg text-white overflow-hidden"
      onClick={onEnter}
    >
        <Particles
            id="landing-tsparticles"
            init={particlesInit}
            options={landingParticlesOptions}
            className="absolute inset-0 z-0"
        />
        <div className="relative z-10 text-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
            >
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 animate-glow text-white">
                    DormSync
                </h1>
                <p className="text-xl md:text-2xl text-base-200 mb-8">
                    Smart Living, Smarter Management.
                </p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="mt-12"
            >
                <p className="text-lg text-accent animate-pulse">
                    Click anywhere to continue
                </p>
            </motion.div>
        </div>
    </div>
  );
};

export default LandingPage;