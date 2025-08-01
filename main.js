import { invitacion } from "./data.js";

// Force scroll to top immediately
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// GSAP and ScrollTrigger registration
gsap.registerPlugin(ScrollTrigger);

// --- Content Injection ---
document.addEventListener("DOMContentLoaded", () => {
  // Always start at the top of the page
  window.scrollTo(0, 0);
  
  // Initialize fireworks controller
  const fireworksController = new FireworksController();

  document.getElementById("festejada-name").textContent = invitacion.festejada;
  document.getElementById("medallion-name").textContent =
    invitacion.medallionName;
  document.getElementById("invitation-date").textContent = invitacion.fecha;

  // Format and display celebration date
  const formatCelebrationDate = (fecha, hora) => {
    const date = new Date(`${fecha} ${hora}:00`);
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const formattedDate = date.toLocaleDateString('es-MX', options);
    const [hours, minutes] = hora.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'pm' : 'am';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const formattedTime = `${hour12}:${minutes} ${ampm}`;
    
    return `${formattedDate} a las ${formattedTime}`;
  };

  document.getElementById("celebration-date-text").textContent = 
    formatCelebrationDate(invitacion.fecha, invitacion.hora);

  // --- Countdown Timer ---
  function updateCountdown() {
    // Combine fecha and hora to create target date
    const targetDateString = `${invitacion.fecha} ${invitacion.hora}:00`;
    const targetDate = new Date(targetDateString).getTime();
    const now = new Date().getTime();
    const timeLeft = targetDate - now;

    if (timeLeft > 0) {
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      document.getElementById("days").textContent = days
        .toString()
        .padStart(2, "0");
      document.getElementById("hours").textContent = hours
        .toString()
        .padStart(2, "0");
      document.getElementById("minutes").textContent = minutes
        .toString()
        .padStart(2, "0");
      document.getElementById("seconds").textContent = seconds
        .toString()
        .padStart(2, "0");
    } else {
      document.getElementById("days").textContent = "00";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";
    }
  }

  // Update countdown immediately and then every second
  updateCountdown();
  setInterval(updateCountdown, 1000);
  document.getElementById("welcome-message").textContent =
    invitacion.mensajeBienvenida;
  document.getElementById("acknowledgement-message").textContent =
    invitacion.agradecimiento;
  document.getElementById("padres-names").textContent =
    invitacion.padres.join(" y ");
  document.getElementById("padrinos-names").textContent =
    invitacion.padrinos.join(" y ");

  const programTimeline = document.getElementById("program-timeline");
  const iconMap = {
    church: "⛪",
    celebration: "🎉",
    event: "📅",
  };

  invitacion.programa.forEach((item) => {
    const timelineItem = document.createElement("div");
    timelineItem.classList.add("timeline-item");

    // Use emoji icons for better cross‑browser support
    const icon = iconMap[item.icono] || iconMap.event;

    // Convert 24h format to 12h Mexican format
    const formatHour = (hora24) => {
      const [hours, minutes] = hora24.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "pm" : "am";
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${hour12}:${minutes} ${ampm}`;
    };

    // Check if location has coordinates for map functionality
    const hasCoords = item.coords && item.coords.length === 2;
    const locationClass = hasCoords ? 'timeline-location clickable-location' : 'timeline-location';
    const mapIndicator = hasCoords ? '<span class="map-indicator" title="Ver en mapa">🗺️</span>' : '';
    
    timelineItem.innerHTML = `
            <div class="timeline-marker">
                <span class="timeline-icon">${icon}</span>
            </div>
            <div class="timeline-content">
                <div class="timeline-time">${formatHour(item.hora)}</div>
                <div class="timeline-event">${item.evento}</div>
                <div class="${locationClass}" ${hasCoords ? `data-coords="${item.coords[0]},${item.coords[1]}"` : ''}>
                    <span class="location-icon">📍</span>
                    ${item.lugar}
                    ${mapIndicator}
                </div>
            </div>
        `;
        
    // Add click event for locations with coordinates
    if (hasCoords) {
        const locationElement = timelineItem.querySelector('.clickable-location');
        locationElement.addEventListener('click', () => {
            const [lat, lng] = item.coords;
            const googleMapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
            window.open(googleMapsUrl, '_blank');
        });
    }
    programTimeline.appendChild(timelineItem);
  });

  // Add dress code with icon
  const dressCodeElement = document.getElementById("dress-code");
  dressCodeElement.innerHTML = `
    <div class="dress-code-icons">
      <img src="${invitacion.dressCodeIcon}" alt="Formal/Gala" class="dress-code-image" />
    </div>
    <div class="dress-code-text">${invitacion.dressCode}</div>
  `;

  const giftsInfo = document.getElementById("gifts-info");
  giftsInfo.innerHTML = "";
  invitacion.regalos.forEach((regalo) => {
    const giftDiv = document.createElement("div");
    giftDiv.classList.add("gift-item");
    giftDiv.innerHTML = `
            <img src="${regalo.imagne}" alt="Regalo" class="gift-image">
            <p class="gift-description">${regalo.descripcion}</p>
        `;
    giftsInfo.appendChild(giftDiv);
  });

  document.getElementById("rsvp-button").href = invitacion.rsvpLink;

  // --- Animations ---

  // Scene 1: Gift Box Opening
  const giftBoxTop = document.getElementById("gift-box-top");
  const filigree = document.getElementById("filigree");
  const ribbonLeft = document.getElementById("ribbon-left");
  const ribbonRight = document.getElementById("ribbon-right");
  const medallion = document.getElementById("medallion");
  const scene1 = document.getElementById("scene1");
  const scene2 = document.getElementById("scene2");
  const inviteBox = document.querySelector(".invite-box");
  const topFloral = document.querySelector(".top-floral");
  const bottomFloral = document.querySelector(".bottom-floral");
  const goldFrame = document.querySelector(".gold-frame");
  const countdownContainer = document.getElementById("countdown-container");

  // Initially hide the open invitation box
  gsap.set(inviteBox, { opacity: 0, rotationY: 10 });

  const introTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: scene1,
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          // Smooth fade out countdown and scene1 as we scroll down
          const progress = self.progress;
          const countdownOpacity = Math.max(0, 1 - progress * 1.2);
          const scene1Opacity = Math.max(0.3, 1 - progress * 0.7);
          
          gsap.set(countdownContainer, { opacity: countdownOpacity });
          gsap.set(scene1, { opacity: scene1Opacity });

          // Trigger scroll fireworks
          fireworksController.onScrollFireworks(progress);
        },
        onLeave: () => {
          // Smooth transition to scene2
          gsap.set(scene1, { opacity: 0 }); // Immediately hide scene1
          gsap.set(scene2, { display: "flex", opacity: 0, y: 30 }); // Prepare scene2
          
          // Animate scene2 entrance
          gsap.to(scene2, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          });
          gsap.to(inviteBox, {
            opacity: 1,
            rotationY: 0,
            duration: 0.8,
            ease: "power2.out",
          });
          gsap.to(topFloral, {
            translateY: "0%",
            duration: 0.8,
            ease: "power2.out",
          });
          gsap.to(bottomFloral, {
            translateY: "0%",
            duration: 0.8,
            ease: "power2.out",
          });
          gsap.to(goldFrame, { "--sparkle-opacity": 1, duration: 0.4 });

          // Celebration burst when entering scene 2
          fireworksController.celebrationBurst();

          // Disable ScrollTrigger after first play to conserve resources
          if (introTimeline.scrollTrigger) {
            introTimeline.scrollTrigger.kill();
          }
        },
        onEnterBack: () => {
          // Smooth transition back to scene1
          gsap.set(scene1, { opacity: 1 }); // Immediately restore scene1
          gsap.to(scene2, {
            opacity: 0,
            y: 50,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
              gsap.set(scene2, { display: "none" }); // Hide scene2 completely
            },
          });
          gsap.to(inviteBox, {
            opacity: 0,
            rotationY: 10,
            duration: 0.6,
            ease: "power2.out",
          });
          gsap.to(topFloral, {
            translateY: "-100%",
            duration: 0.6,
            ease: "power2.out",
          });
          gsap.to(bottomFloral, {
            translateY: "100%",
            duration: 0.6,
            ease: "power2.out",
          });
          gsap.to(goldFrame, { "--sparkle-opacity": 0, duration: 0.3 });
          // Restore countdown immediately
          gsap.set(countdownContainer, { opacity: 1 });
        },
      },
    })
    .to(medallion, {
      opacity: 0,
      scale: 0.3,
      y: -20,
      duration: 0.8,
      ease: "power2.out",
    })
    .to(
      ribbonLeft,
      {
        x: -200, // Move left ribbon further out
        rotation: -45, // More pronounced rotation
        opacity: 0,
        scale: 0.8,
        duration: 1.2,
        ease: "power2.inOut",
      },
      "<0.2"
    ) // Start slightly after medallion fades
    .to(
      ribbonRight,
      {
        x: 200, // Move right ribbon further out
        rotation: 45, // More pronounced rotation
        opacity: 0,
        scale: 0.8,
        duration: 1.2,
        ease: "power2.inOut",
      },
      "<"
    ) // Start at the same time as ribbonLeft
    .to(
      giftBoxTop,
      {
        rotationX: -120, // Open the lid more dramatically
        y: -giftBoxTop.offsetHeight * 1.2, // Move lid up significantly
        opacity: 0, // Fade out the lid as it opens
        scale: 0.9,
        duration: 1.8,
        ease: "power2.inOut",
      },
      "<0.3"
    ) // Start opening lid after ribbons move a bit
    .to(
      filigree,
      {
        opacity: 0,
        scale: 0.5,
        duration: 1,
        ease: "power2.out",
      },
      "<0.2"
    ) // Fade out filigree slightly after lid starts opening
    .to(
      "#gift-box-container",
      {
        opacity: 0,
        scale: 0.7,
        y: 50,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          // Gift box fully opened - celebration!
          fireworksController.celebrationBurst();
        },
      },
      "<0.5"
    ); // Fade out entire gift box container

  // Scene 2: Simplified content reveal to improve performance
  ScrollTrigger.batch(".content-block", {
    start: "top 90%",
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
      }),
    onLeaveBack: (batch) =>
      gsap.set(batch, { opacity: 0, y: 40 }),
    once: true,
  });

  // Quick navigation: skip intro and scroll to section
  function skipIntroAndScroll(target) {
    if (introTimeline.scrollTrigger && !introTimeline.scrollTrigger.disabled) {
      introTimeline.scrollTrigger.kill();
      introTimeline.progress(1);
    }
    gsap.set(scene1, { opacity: 0 });
    gsap.set(scene2, { display: "flex", opacity: 1, y: 0 });
    gsap.set(inviteBox, { opacity: 1, rotationY: 0 });
    setTimeout(() => {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  document.querySelectorAll("#quick-nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("href");
      skipIntroAndScroll(target);
    });
  });
});
