// RSVP Button Visibility and Interaction Fix
class RSVPButtonManager {
  constructor() {
    this.button = null;
    this.rsvpSection = null;
    this.observer = null;
    this.scrollTimeout = null;
    this.isInitialized = false;

    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setupButton());
    } else {
      this.setupButton();
    }
  }

  setupButton() {
    this.button = document.getElementById("rsvp-button");
    this.rsvpSection = document.querySelector(".rsvp-section");

    if (!this.button || !this.rsvpSection) {
      console.warn("RSVP button or section not found, retrying...");
      setTimeout(() => this.setupButton(), 500);
      return;
    }

    // Wait for GSAP to be ready if it exists
    if (window.gsap) {
      // Override GSAP animations for RSVP section
      this.preventGSAPConflicts();
    }

    this.ensureButtonVisibility();
    this.setupIntersectionObserver();
    this.setupScrollHandler();
    this.setupClickHandler();
    this.setupAccessibility();
    this.forceVisibility();

    this.isInitialized = true;
    console.log("RSVP Button Manager initialized successfully");
  }

  preventGSAPConflicts() {
    // Create a GSAP timeline specifically for RSVP that overrides others
    if (window.gsap && window.ScrollTrigger) {
      gsap.set(this.rsvpSection, {
        opacity: 1,
        y: 0,
        scale: 1,
        force3D: false,
        clearProps: "transform,opacity",
      });

      // Create a permanent override
      ScrollTrigger.create({
        trigger: this.rsvpSection,
        start: "top bottom",
        end: "bottom top",
        onUpdate: () => {
          gsap.set(this.rsvpSection, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0,
          });
        },
      });
    }
  }

  ensureButtonVisibility() {
    // Force visibility with less aggressive approach
    const styles = {
      display: "inline-block",
      visibility: "visible",
      opacity: "1",
      position: "relative",
      zIndex: "100",
      pointerEvents: "auto",
    };

    // Apply styles more gently
    Object.assign(this.button.style, styles);

    // Add classes for CSS targeting
    this.button.classList.add("visible", "force-visible");
    this.rsvpSection.classList.add("visible", "in-view", "is-in-view");

    // Override GSAP animations only when necessary
    if (window.gsap && !this.isVisible()) {
      gsap.set(this.rsvpSection, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.1,
        ease: "none",
      });
      gsap.set(this.button, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.1,
        ease: "none",
      });
    }
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: "100px 0px", // Increased margin to trigger earlier
      threshold: [0.1], // Simplified threshold
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === this.rsvpSection) {
          if (entry.isIntersecting) {
            // Only add classes, don't force styles to avoid conflicts
            this.rsvpSection.classList.add("in-view", "is-in-view");
            this.button.classList.add("visible");
          }
          // Always keep visible regardless of intersection
          this.ensureMinimalVisibility();
        }
      });
    }, options);

    this.observer.observe(this.rsvpSection);
  }

  ensureMinimalVisibility() {
    // Minimal intervention to avoid conflicts
    if (!this.isVisible()) {
      this.rsvpSection.style.opacity = "1";
      this.button.style.opacity = "1";
      this.button.style.visibility = "visible";
      this.button.style.display = "inline-block";
    }
  }

  setupScrollHandler() {
    let ticking = false;
    let lastScrollY = window.scrollY;
    let scrollDirection = "down";

    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Use passive scroll listener with reduced frequency
    window.addEventListener("scroll", scrollHandler, { passive: true });
    window.addEventListener(
      "resize",
      () => {
        setTimeout(() => this.ensureButtonVisibility(), 100);
      },
      { passive: true }
    );
  }

  handleScroll() {
    // Clear any previous timeout
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Only check visibility when necessary, not constantly
    const currentScrollY = window.scrollY;
    const scrollDirection = currentScrollY > this.lastScrollY ? "down" : "up";
    this.lastScrollY = currentScrollY;

    // Less aggressive checking during scroll
    if (!this.isVisible()) {
      this.ensureButtonVisibility();
    }

    // Only force visibility check after scroll ends
    this.scrollTimeout = setTimeout(() => {
      if (!this.isVisible()) {
        this.forceVisibility();
      }
    }, 150);
  }

  makeButtonVisible() {
    if (!this.button) return;

    // Remove any potential hiding classes
    this.button.classList.remove("hidden", "fade-out");
    this.button.classList.add("visible", "fade-in");

    // Force styles with smooth transitions
    const smoothStyles = {
      display: "inline-block",
      visibility: "visible",
      opacity: "1",
      transform: "translateY(0)",
      zIndex: "100",
      transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
    };

    Object.assign(this.button.style, smoothStyles);

    // Trigger reflow to ensure styles are applied
    this.button.offsetHeight;
  }

  forceVisibility() {
    if (!this.button || !this.rsvpSection) return;

    // Force visibility with maximum specificity
    const forceStyles = `
            display: inline-block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            z-index: 100 !important;
            pointer-events: auto !important;
            transform: translateY(0) translateZ(0) !important;
        `;

    this.button.style.cssText += forceStyles;
    this.rsvpSection.style.cssText += `
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            z-index: 50 !important;
            transform: translateY(0) scale(1) !important;
        `;

    // Override any GSAP animations
    if (window.gsap) {
      gsap.killTweensOf(this.rsvpSection);
      gsap.killTweensOf(this.button);
      gsap.set(this.rsvpSection, {
        opacity: 1,
        y: 0,
        scale: 1,
        force3D: false,
      });
      gsap.set(this.button, {
        opacity: 1,
        y: 0,
        scale: 1,
        force3D: false,
      });
    }
  }

  setupClickHandler() {
    if (!this.button) return;

    this.button.addEventListener("click", (e) => {
      // Prevent any interference
      e.stopPropagation();

      // Add click feedback
      this.button.classList.add("clicked");
      setTimeout(() => {
        this.button.classList.remove("clicked");
      }, 300);

      // Get RSVP URL from data
      const rsvpUrl = window.invitationData?.rsvp || "#";
      if (rsvpUrl !== "#") {
        this.button.href = rsvpUrl;
      }
    });

    // Prevent right-click menu that might interfere
    this.button.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }

  setupAccessibility() {
    if (!this.button) return;

    // Ensure button is properly accessible
    this.button.setAttribute("role", "button");
    this.button.setAttribute(
      "aria-label",
      "Confirmar asistencia a la celebración"
    );
    this.button.setAttribute("tabindex", "0");

    // Handle keyboard navigation
    this.button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.button.click();
      }
    });
  }

  // Public method to force refresh
  refresh() {
    this.forceVisibility();
    this.ensureButtonVisibility();
  }

  // Public method to check if button is visible
  isVisible() {
    if (!this.button) return false;

    const rect = this.button.getBoundingClientRect();
    const style = window.getComputedStyle(this.button);

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.opacity !== "0" &&
      style.visibility !== "hidden" &&
      style.display !== "none"
    );
  }

  // Cleanup method
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }
}

// Initialize the RSVP Button Manager
let rsvpManager;

// Auto-initialize
document.addEventListener("DOMContentLoaded", () => {
  rsvpManager = new RSVPButtonManager();
});

// Backup initialization for dynamic content
if (document.readyState !== "loading") {
  rsvpManager = new RSVPButtonManager();
}

// Global function to force button visibility (for debugging)
window.forceRSVPVisibility = () => {
  if (rsvpManager) {
    rsvpManager.refresh();
    console.log(
      "RSVP Button visibility forced. Is visible:",
      rsvpManager.isVisible()
    );
  } else {
    console.warn("RSVP Manager not initialized");
  }
};

// Additional safety check - less frequent to avoid conflicts
setInterval(() => {
  if (rsvpManager && !rsvpManager.isVisible()) {
    console.warn("RSVP button not visible, forcing visibility...");
    rsvpManager.refresh();
  }
}, 5000); // Increased from 3000 to 5000ms

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && rsvpManager) {
    setTimeout(() => rsvpManager.refresh(), 100);
  }
});

// Export for potential external use
window.RSVPButtonManager = RSVPButtonManager;
