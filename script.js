
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const loader = document.querySelector(".loader");
  const header = document.querySelector(".header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav-link");

  // EDIT THIS NUMBER BEFORE DEPLOYING.
  // Use your gym's WhatsApp number with country code, without + or spaces.
  const WHATSAPP_NUMBER = "";

  // Make the current year automatic.
  document.querySelector("#year").textContent = new Date().getFullYear();

  // Enable animations only if the browser supports GSAP.
  const hasGSAP =
    typeof window.gsap !== "undefined" &&
    typeof window.ScrollTrigger !== "undefined";

  // Respect the visitor's motion accessibility preference.
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // --------------------------------------------------
  // MOBILE NAVIGATION
  // --------------------------------------------------

  function closeMenu() {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    body.classList.remove("menu-open");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );

    body.classList.toggle("menu-open", isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) closeMenu();
  });

  // --------------------------------------------------
  // HEADER SCROLL EFFECT
  // --------------------------------------------------

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 60);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // --------------------------------------------------
  // NAVIGATION ACTIVE SECTION
  // --------------------------------------------------

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            const active = link.getAttribute("href") ===
              `#${entry.target.id}`;

            link.classList.toggle("active", active);
          });
        });
      },
      {
        rootMargin: "-25% 0px -65% 0px",
        threshold: 0
      }
    );

    document.querySelectorAll("main section[id]").forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // --------------------------------------------------
  // COUNTER ANIMATION
  // --------------------------------------------------

  function setCounter(element, value) {
    const suffix = element.dataset.suffix || "";
    element.textContent = value.toLocaleString("en-IN") + suffix;
  }

  function animateCounter(element) {
    const target = Number(element.dataset.count || 0);

    if (reduceMotion || !hasGSAP) {
      setCounter(element, target);
      return;
    }

    const counter = { value: 0 };

    gsap.to(counter, {
      value: target,
      duration: 1.8,
      ease: "power2.out",
      onUpdate: () => {
        setCounter(element, Math.floor(counter.value));
      },
      scrollTrigger: {
        trigger: element,
        start: "top 90%",
        once: true
      }
    });
  }

  // --------------------------------------------------
  // GSAP ANIMATIONS
  // --------------------------------------------------

  function initializeAnimations() {
    if (!hasGSAP || reduceMotion) {
      if (loader) loader.remove();

      document.querySelectorAll(".reveal").forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
      });

      document.querySelectorAll(".hero-eyebrow, .hero-title, .hero-copy, .hero-actions, .hero-note, .hero-metric, .scroll-indicator").forEach((element) => {
        element.style.opacity = "1";
      });

      document.querySelectorAll("[data-count]").forEach((element) => {
        setCounter(element, Number(element.dataset.count || 0));
      });

      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Avoid flash of hidden content while GSAP initializes.
    body.classList.add("js-ready");

    const intro = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        if (loader) {
          gsap.to(loader, {
            opacity: 0,
            duration: 0.45,
            onComplete: () => loader.remove()
          });
        }
      }
    });

    intro.to(".loader-progress", {
      scaleX: 1,
      duration: 0.65,
      ease: "power2.inOut"
    });

    intro.to(".loader-brand", {
      y: -8,
      opacity: 0,
      duration: 0.25
    }, "-=0.1");

    intro.fromTo(
      ".hero-eyebrow",
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55 }
    );

    intro.fromTo(
      ".hero-title",
      { y: 75, opacity: 0, skewY: 3 },
      {
        y: 0,
        opacity: 1,
        skewY: 0,
        duration: 0.9,
        ease: "power4.out"
      },
      "-=0.3"
    );

    intro.fromTo(
      ".hero-copy",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      "-=0.4"
    );

    intro.fromTo(
      ".hero-actions",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      "-=0.3"
    );

    intro.fromTo(
      ".hero-note",
      { opacity: 0 },
      { opacity: 1, duration: 0.4 },
      "-=0.2"
    );

    intro.fromTo(
      ".hero-metric",
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.45,
        stagger: 0.12
      },
      "-=0.2"
    );

    intro.fromTo(
      ".scroll-indicator",
      { opacity: 0, x: 15 },
      { opacity: 1, x: 0, duration: 0.4 },
      "-=0.3"
    );

    // Subtle cinematic image movement.
    gsap.to(".hero-image", {
      scale: 1,
      duration: 2.4,
      ease: "power2.out"
    });

    // Scroll-based reveal animations.
    gsap.utils.toArray(".reveal").forEach((element) => {
      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          once: true
        }
      });
    });

    // Animated statistics.
    document.querySelectorAll("[data-count]").forEach(animateCounter);

    // Subtle parallax on the story image.
    if (window.matchMedia("(min-width: 801px)").matches) {
      gsap.to(".about-visual > img", {
        yPercent: -5,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }

    // Refresh measurements after images finish loading.
    window.addEventListener("load", () => {
      ScrollTrigger.refresh();
    }, { once: true });
  }

  // --------------------------------------------------
  // MEMBERSHIP PLAN SHORTCUTS
  // --------------------------------------------------

  document.querySelectorAll(".plan-enquiry").forEach((button) => {
    button.addEventListener("click", () => {
      const plan = button.dataset.plan;
      const messageField = document.querySelector("#message");

      messageField.value = `I'm interested in the ${plan} membership. Please share the details.`;
    });
  });

  // --------------------------------------------------
  // WHATSAPP ENQUIRY FORM
  // --------------------------------------------------

  const enquiryForm = document.querySelector("#enquiry-form");

  enquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!enquiryForm.reportValidity()) return;

    if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
      alert("Please configure the gym's WhatsApp number in script.js.");
      return;
    }

    const formData = new FormData(enquiryForm);

    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const goal = String(formData.get("goal") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const enquiry = [
      "Hello VOLT Athletics!",
      "",
      "I'd like to enquire about gym membership.",
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Fitness goal: ${goal}`,
      `Message: ${message || "No additional message"}`,
      "",
      "Please share the available options and details."
    ].join("\n");

    const whatsappURL =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(enquiry)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  });

  // --------------------------------------------------
  // WHATSAPP FLOATING BUTTON
  // --------------------------------------------------

  const floatingWhatsApp = document.querySelector("#whatsapp-float");

  if (/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
    floatingWhatsApp.href =
      `https://wa.me/${WHATSAPP_NUMBER}?text=` +
      encodeURIComponent("Hello! I'd like to know more about your gym memberships.");
  }

  // --------------------------------------------------
  // STARTUP
  // --------------------------------------------------

  initializeAnimations();
});
