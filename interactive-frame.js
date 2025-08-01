/* Interactive Frame Effects JavaScript */

document.addEventListener("DOMContentLoaded", function () {
  const goldFrame = document.querySelector(".gold-frame");

  if (!goldFrame) return;

  // Variables for scroll effects
  let scrollY = 0;
  let ticking = false;
  const setFrameY = gsap.quickSetter(goldFrame, "y", "px");
  const setGlow = gsap.quickSetter(goldFrame, "--glow-intensity");
  const setBorderSpeed = gsap.quickSetter(goldFrame, "--border-animation-speed");
  const frameOffsetTop = goldFrame.offsetTop;
  const frameHeight = goldFrame.offsetHeight;

  // Intersection Observer for frame visibility
  let frameActivated = false;

  const frameObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !frameActivated) {
          frameActivated = true;
          entry.target.classList.add("frame-visible");
          entry.target.style.setProperty("--sparkle-opacity", "0.5");
          observer.unobserve(entry.target);
        } else if (!entry.isIntersecting && frameActivated) {
          entry.target.style.setProperty("--sparkle-opacity", "0");
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  frameObserver.observe(goldFrame);

  // Scroll-based animation effects
  function updateScrollEffects() {
    const scrollPercent = Math.min(scrollY / window.innerHeight, 1);
    const frameTop = frameOffsetTop - scrollY;
    const frameBottom = frameTop + frameHeight;
    if (frameBottom < 0 || frameTop > window.innerHeight) {
      ticking = false;
      return;
    }

    const frameCenter = frameTop + frameHeight / 2;
    const windowCenter = window.innerHeight / 2;
    const distanceFromCenter = Math.abs(frameCenter - windowCenter);
    const maxDistance = window.innerHeight / 2;
    const proximityFactor = Math.max(0, 1 - distanceFromCenter / maxDistance);

    // Dynamic glow based on scroll position
    const glowIntensity = 0.3 + proximityFactor * 0.4;
    setGlow(glowIntensity);

    // Dynamic border animation speed
    const animationSpeed = Math.max(3, 8 - proximityFactor * 5);
    setBorderSpeed(`${animationSpeed}s`);

    // Parallax effect for the frame
    const parallaxOffset = scrollPercent * 10;
    setFrameY(parallaxOffset);

    ticking = false;
  }

  function requestScrollUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  }

  // Optimized scroll listener
  window.addEventListener(
    "scroll",
    function () {
      scrollY = window.scrollY;
      requestScrollUpdate();
    },
    { passive: true }
  );

  // Mouse move effects for interactive glow
  goldFrame.addEventListener("mousemove", function (e) {
    const rect = goldFrame.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Update CSS custom properties for mouse-based effects
    goldFrame.style.setProperty("--mouse-x", `${x}%`);
    goldFrame.style.setProperty("--mouse-y", `${y}%`);

    // Dynamic sparkle position based on mouse
    goldFrame.style.setProperty(
      "--particle-1-x",
      `${Math.max(10, Math.min(90, x - 10))}%`
    );
    goldFrame.style.setProperty(
      "--particle-2-x",
      `${Math.max(10, Math.min(90, x + 15))}%`
    );
    goldFrame.style.setProperty(
      "--particle-1-y",
      `${Math.max(10, Math.min(90, y - 15))}%`
    );
    goldFrame.style.setProperty(
      "--particle-2-y",
      `${Math.max(10, Math.min(90, y + 10))}%`
    );
  });

  // Reset mouse effects when mouse leaves
  goldFrame.addEventListener("mouseleave", function () {
    goldFrame.style.removeProperty("--mouse-x");
    goldFrame.style.removeProperty("--mouse-y");
    // Reset to default particle positions
    goldFrame.style.setProperty("--particle-1-x", "20%");
    goldFrame.style.setProperty("--particle-2-x", "70%");
    goldFrame.style.setProperty("--particle-1-y", "30%");
    goldFrame.style.setProperty("--particle-2-y", "60%");
  });

  // Touch interaction for mobile
  goldFrame.addEventListener(
    "touchstart",
    function () {
      goldFrame.style.setProperty("--sparkle-opacity", "0.8");
      goldFrame.style.setProperty("--glow-intensity", "0.9");
    },
    { passive: true }
  );

  goldFrame.addEventListener(
    "touchend",
    function () {
      setTimeout(() => {
        goldFrame.style.setProperty("--sparkle-opacity", "0.5");
        goldFrame.style.setProperty("--glow-intensity", "0.3");
      }, 300);
    },
    { passive: true }
  );

  // Periodic sparkle bursts
  setInterval(() => {
    if (goldFrame.classList.contains("frame-visible")) {
      goldFrame.style.setProperty("--sparkle-opacity", "0.9");
      setTimeout(() => {
        goldFrame.style.setProperty("--sparkle-opacity", "0.5");
      }, 1500);
    }
  }, 8000);

  // Add random subtle glow variations
  setInterval(() => {
    if (!goldFrame.matches(":hover")) {
      const currentGlow =
        parseFloat(goldFrame.style.getPropertyValue("--glow-intensity")) || 0.3;
      const variation = (Math.random() - 0.5) * 0.1;
      const newGlow = Math.max(0.2, Math.min(0.6, currentGlow + variation));
      goldFrame.style.setProperty("--glow-intensity", newGlow);
    }
  }, 3000);
});
