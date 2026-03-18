import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fpsLimit: 120,
        particles: {
          color: { value: "#ffffff" },
          links: {
            color: "#6366f1",
            distance: 200,
            enable: true,
            opacity: 0.1,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.6,
            direction: "none",
            random: true,
            straight: false,
            outModes: { default: "out" },
          },
          number: {
            density: { enable: true, area: 1200 },
            value: 60,
          },
          opacity: {
            value: 0.2,
          },
          size: {
            value: { min: 1, max: 2 },
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
          },
          modes: {
            grab: {
              distance: 250,
              links: { opacity: 0.2 },
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
