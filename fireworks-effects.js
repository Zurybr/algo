// Fireworks and particle effects for the XV Años invitation
class FireworksController {
  constructor() {
    this.fireworksContainer = document.getElementById('fireworks-container');
    this.sparklesCanvas = document.getElementById('sparkles-canvas');
    this.ctx = this.sparklesCanvas.getContext('2d');
    this.sparkles = [];
    this.fireworks = null;
    
    this.setupCanvas();
    this.initSparkles();
    this.startSparkleAnimation();
  }

  setupCanvas() {
    this.sparklesCanvas.width = window.innerWidth;
    this.sparklesCanvas.height = window.innerHeight;
    this.sparklesCanvas.style.position = 'fixed';
    this.sparklesCanvas.style.top = '0';
    this.sparklesCanvas.style.left = '0';
    this.sparklesCanvas.style.pointerEvents = 'none';
    this.sparklesCanvas.style.zIndex = '1';
    this.sparklesCanvas.style.opacity = '0.7';

    // Resize canvas on window resize
    window.addEventListener('resize', () => {
      this.sparklesCanvas.width = window.innerWidth;
      this.sparklesCanvas.height = window.innerHeight;
    });
  }

  initSparkles() {
    const numberOfSparkles = 20; // Reduced from 50 for performance
    for (let i = 0; i < numberOfSparkles; i++) {
      this.sparkles.push({
        x: Math.random() * this.sparklesCanvas.width,
        y: Math.random() * this.sparklesCanvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        color: this.getSparkleColor()
      });
    }
  }

  getSparkleColor() {
    const colors = ['#FFD700', '#FFF8DC', '#FFFACD', '#F0E68C', '#DAA520'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  updateSparkles() {
    this.sparkles.forEach(sparkle => {
      sparkle.x += sparkle.speedX;
      sparkle.y += sparkle.speedY;
      sparkle.opacity += Math.sin(Date.now() * sparkle.twinkleSpeed) * 0.01;

      // Wrap around screen
      if (sparkle.x > this.sparklesCanvas.width) sparkle.x = 0;
      if (sparkle.x < 0) sparkle.x = this.sparklesCanvas.width;
      if (sparkle.y > this.sparklesCanvas.height) sparkle.y = 0;
      if (sparkle.y < 0) sparkle.y = this.sparklesCanvas.height;

      // Keep opacity in bounds
      sparkle.opacity = Math.max(0.1, Math.min(0.9, sparkle.opacity));
    });
  }

  drawSparkles() {
    this.ctx.clearRect(0, 0, this.sparklesCanvas.width, this.sparklesCanvas.height);
    
    this.sparkles.forEach(sparkle => {
      this.ctx.save();
      this.ctx.globalAlpha = sparkle.opacity;
      this.ctx.fillStyle = sparkle.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = sparkle.color;
      
      // Draw sparkle as a star
      this.drawStar(sparkle.x, sparkle.y, sparkle.size);
      this.ctx.restore();
    });
  }

  drawStar(x, y, size) {
    this.ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const x1 = x + Math.cos(angle) * size;
      const y1 = y + Math.sin(angle) * size;
      const x2 = x + Math.cos(angle + Math.PI / 5) * (size * 0.5);
      const y2 = y + Math.sin(angle + Math.PI / 5) * (size * 0.5);
      
      if (i === 0) this.ctx.moveTo(x1, y1);
      else this.ctx.lineTo(x1, y1);
      this.ctx.lineTo(x2, y2);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  startSparkleAnimation() {
    const animate = () => {
      this.updateSparkles();
      this.drawSparkles();
      requestAnimationFrame(animate);
    };
    animate();
  }

  // Disney-style fireworks burst
  createDisneyFireworks() {
    // Canvas confetti fireworks
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#D4AF37', '#8B0000', '#FFF8DC']
    });

    // Multiple bursts for Disney effect
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: 0.3, y: 0.7 },
        colors: ['#FFD700', '#D4AF37', '#8B0000']
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: 0.7, y: 0.7 },
        colors: ['#FFD700', '#D4AF37', '#8B0000']
      });
    }, 400);
  }

  // Initialize fireworks.js for continuous effects
  initFireworks() {
    if (this.fireworks) {
      this.fireworks.stop();
    }

    this.fireworks = new Fireworks(this.fireworksContainer, {
      rocketsPoint: {
        min: 50,
        max: 50
      },
      hue: {
        min: 0,
        max: 60
      },
      delay: {
        min: 30,
        max: 60
      },
      speed: 2,
      acceleration: 1.05,
      friction: 0.95,
      gravity: 1.5,
      particles: 50,
      trace: 3,
      explosion: 5,
      autoresize: true,
      brightness: {
        min: 50,
        max: 80
      },
      decay: {
        min: 0.015,
        max: 0.03
      },
      mouse: {
        click: false,
        move: false,
        max: 1
      }
    });
  }

  startFireworks() {
    this.initFireworks();
    this.fireworks.start();
  }

  stopFireworks() {
    if (this.fireworks) {
      this.fireworks.stop();
    }
  }

  // Celebration burst when gift box opens
  celebrationBurst() {
    this.createDisneyFireworks();
    
    // Add extra sparkles
    for (let i = 0; i < 20; i++) {
      this.sparkles.push({
        x: Math.random() * this.sparklesCanvas.width,
        y: Math.random() * this.sparklesCanvas.height,
        size: Math.random() * 5 + 2,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        opacity: 1,
        twinkleSpeed: Math.random() * 0.05 + 0.02,
        color: this.getSparkleColor()
      });
    }

    // Remove extra sparkles after animation
    setTimeout(() => {
      this.sparkles = this.sparkles.slice(0, 50);
    }, 3000);
  }

  // Scroll-triggered fireworks
  onScrollFireworks(progress) {
    if (progress > 0.3 && progress < 0.7) {
      // Random chance of fireworks during scroll
      if (Math.random() < 0.02) {
        this.createDisneyFireworks();
      }
    }
  }
}

// Export for use in main.js
window.FireworksController = FireworksController;