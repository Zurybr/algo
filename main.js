import { invitacion } from "./data.js";

// GSAP and ScrollTrigger registration
gsap.registerPlugin(ScrollTrigger);

// --- Content Injection ---
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("festejada-name").textContent = invitacion.festejada;
  document.getElementById("medallion-name").textContent =
    invitacion.medallionName;
  document.getElementById("invitation-date").textContent = invitacion.fecha;

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
  invitacion.programa.forEach((item) => {
    const timelineItem = document.createElement("div");
    timelineItem.classList.add("timeline-item");

    const icon = item.evento.toLowerCase().includes("misa")
      ? "church"
      : "celebration";

    // Convert 24h format to 12h Mexican format
    const formatHour = (hora24) => {
      const [hours, minutes] = hora24.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "pm" : "am";
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${hour12}:${minutes} ${ampm}`;
    };

    timelineItem.innerHTML = `
            <div class="timeline-marker">
                <span class="material-symbols-outlined timeline-icon">${icon}</span>
            </div>
            <div class="timeline-content">
                <div class="timeline-time">${formatHour(item.hora)}</div>
                <div class="timeline-event">${item.evento}</div>
                <div class="timeline-location">
                    <span class="material-symbols-outlined location-icon">place</span>
                    ${item.lugar}
                </div>
            </div>
        `;
    programTimeline.appendChild(timelineItem);
  });

  document.getElementById("dress-code").textContent = invitacion.dressCode;

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

  gsap
    .timeline({
      scrollTrigger: {
        trigger: scene1,
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          // Fade out countdown and entire scene1 as we scroll down
          const progress = self.progress;
          gsap.to(countdownContainer, {
            opacity: 1 - progress,
            duration: 0.1,
            ease: "none",
          });
          gsap.to(scene1, {
            opacity: 1 - progress * 0.5,
            duration: 0.1,
            ease: "none",
          });
        },
        onLeave: () => {
          // Complete fade out of scene1
          gsap.to(scene1, { opacity: 0, duration: 0.5, ease: "power2.out" });
          gsap.set(scene2, { display: "flex" }); // Make scene2 visible
          gsap.to(scene2, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          });
          gsap.to(inviteBox, {
            opacity: 1,
            rotationY: 0,
            duration: 1,
            ease: "power2.out",
          });
          gsap.to(topFloral, {
            translateY: "0%",
            duration: 1,
            ease: "power2.out",
          });
          gsap.to(bottomFloral, {
            translateY: "0%",
            duration: 1,
            ease: "power2.out",
          });
          gsap.to(goldFrame, { "--sparkle-opacity": 1, duration: 0.5 });
        },
        onEnterBack: () => {
          // Restore scene1 opacity when scrolling back up
          gsap.to(scene1, { opacity: 1, duration: 0.5, ease: "power2.out" });
          gsap.to(scene2, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
              gsap.set(scene2, { display: "none" }); // Hide scene2 completely
            },
          });
          gsap.to(inviteBox, {
            opacity: 0,
            rotationY: 10,
            duration: 0.8,
            ease: "power2.out",
          });
          gsap.to(topFloral, {
            translateY: "-100%",
            duration: 0.8,
            ease: "power2.out",
          });
          gsap.to(bottomFloral, {
            translateY: "100%",
            duration: 0.8,
            ease: "power2.out",
          });
          gsap.to(goldFrame, { "--sparkle-opacity": 0, duration: 0.5 });
          // Restore countdown when scrolling back up
          gsap.to(countdownContainer, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          });
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
      },
      "<0.5"
    ); // Fade out entire gift box container

  // Scene 2: Content Block Fade-in + Micro-parallax + Pop effect
  gsap.utils.toArray(".content-block").forEach((block) => {
    gsap.fromTo(
      block,
      { opacity: 0, y: 50, scale: 0.95 }, // Initial scale for pop effect
      {
        opacity: 1,
        y: 0,
        scale: 1, // Final scale
        duration: 1, // Longer duration for smoother pop
        ease: "power2.out", // Stronger ease for pop
        scrollTrigger: {
          trigger: block,
          start: "top 80%", // Trigger earlier
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          onUpdate: (self) => {
            const progress = self.progress;
            const parallaxAmount = (1 - progress) * 30; // Increased parallax
            gsap.to(block, { y: parallaxAmount, duration: 0.2, ease: "none" });
          },
        },
      }
    );
  });
});
