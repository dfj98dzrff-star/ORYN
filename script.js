/* ============================================================
   ORYN — script.js
   Vanilla JS only. Lean, deliberate, no dependencies.
   ============================================================ */
(function () {
  "use strict";

  // Respect users who prefer reduced motion.
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------
     1. FOOTER YEAR
  -------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --------------------------------------------------------
     2. STICKY NAV — glass intensifies after scroll
  -------------------------------------------------------- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* --------------------------------------------------------
     3. MOBILE MENU
  -------------------------------------------------------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  const closeMenu = () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Close after selecting a link
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* --------------------------------------------------------
     4. SCROLL REVEAL — IntersectionObserver
     Staggers siblings within the same container.
  -------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          // Stagger based on position among reveal siblings
          const siblings = Array.prototype.filter.call(
            el.parentElement.children,
            (c) => c.classList.contains("reveal")
          );
          const index = siblings.indexOf(el);
          el.style.transitionDelay = Math.min(index * 70, 420) + "ms";
          el.classList.add("is-visible");
          observer.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* --------------------------------------------------------
     5. CARD CURSOR GLOW
     Updates a CSS custom property so the radial highlight
     follows the pointer. Pure presentation, cheap to run.
  -------------------------------------------------------- */
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* --------------------------------------------------------
     6. HERO PARTICLES — subtle, elegant, DPR-aware
     Slow-drifting points connected by faint lines.
     Disabled entirely under reduced-motion.
  -------------------------------------------------------- */
  const canvas = document.getElementById("particles");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let width, height, dpr, particles, rafId;
    const hero = canvas.parentElement;

    // Density scales with viewport but stays restrained.
    const config = { linkDist: 130, speed: 0.18 };

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = hero.offsetWidth;
      height = hero.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(Math.floor((width * height) / 16000), 90);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        r: Math.random() * 1.4 + 0.4,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges for seamless drift
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.fill();

        // Connecting lines
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < config.linkDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(255,255,255,${0.08 * (1 - dist / config.linkDist)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(draw);
    }

    // Pause the loop when the hero scrolls out of view (saves CPU).
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(draw);
          } else {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        });
      },
      { threshold: 0 }
    );

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(size, 200);
    });

    size();
    heroObserver.observe(hero);
  }
})();
