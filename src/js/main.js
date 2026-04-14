document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Lenis Smooth Scroll Configuration
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        smooth: true,
        mouseMultiplier: 1,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Initial Page Load Animations (GSAP)
    gsap.registerPlugin(ScrollTrigger);
    
    const tlLoad = gsap.timeline();
    tlLoad.to(".top-nav", { opacity: 1, y: 10, duration: 1, ease: "power2.out", delay: 0.2 })
      .from("#hero-badge", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
      .from("#hero-title span", { y: 50, opacity: 0, duration: 1.2, stagger: 0.15, ease: "power4.out", clipPath: "inset(100% 0 0 0)" }, "-=0.6")
      .from("#video-wrapper", { scale: 1.1, filter: "blur(20px)", opacity: 0, duration: 2, ease: "power2.out" }, "-=1.2")
      .from("#hero-desc", { x: -30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=1.5")
      .from("#hero-ctas button", { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.5)" }, "-=1.2")
      .from("#float-card-1", { x: 30, opacity: 0, duration: 1, ease: "power2.out" }, "-=1")
      .to("#scroll-prompt", { opacity: 1, duration: 1, ease: "power2.out" }, "-=0.2");

    gsap.to("#float-card-1", { y: -15, duration: 2.5, yoyo: true, repeat: -1, ease: "sine.inOut" });

    // 3. Canvas Image Sequence (Apple-style buttery smooth scrubbing)
    const canvas = document.getElementById("sequence-canvas");
    const context = canvas.getContext("2d");

    // We extracted frames dynamically, ensuring HD viewport
    canvas.width = 1920; 
    canvas.height = 1080;

    const frameCount = 192; // Number of frames configured by the extraction algorithm
    const currentFrame = index => (
        `public/frames/frame_${String(index).padStart(4, '0')}.jpg`
    );

    const images = [];
    const sequenceObj = { frame: 0 };

    // Pre-load frames into memory array 
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }

    // Draw initial frame gracefully
    images[0].onload = render;

    function render() {
        // Keep image centered and scaled filling the canvas without distorting aspect ratio
        if(!images[sequenceObj.frame] || !images[sequenceObj.frame].complete) return;
        const img = images[sequenceObj.frame];
        
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio  = Math.max(hRatio, vRatio); // Use Max to ensure "object-cover" behavior
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;  
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, img.width, img.height,
                          centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    }

    // Bind Scroll mapping
    let tlSequence = gsap.timeline({
        scrollTrigger: {
            trigger: "#playback-space",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2, // Cinematic physics smoothing
        }
    });

    // Tween the frame index along the scroll length
    tlSequence.to(sequenceObj, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        onUpdate: render // Automatically redraws 60fps on scrub update
    }, 0);
    
    // A) Fade out UI gracefully when scrolling begins
    tlSequence.to("#hero-text-block", {
        opacity: 0,
        x: -50,
        filter: "blur(8px)",
        duration: 0.15 // Normalized timeframe (first 15% of scroll)
    }, 0);

    tlSequence.to("#scroll-prompt", {
        opacity: 0,
        y: 20,
        duration: 0.05
    }, 0);

    // B) Fade floating cards isolated
    tlSequence.to("#float-card-1", {
        opacity: 0,
        x: 40,
        duration: 0.15
    }, 0);

    // C) Optional cinematic scale pushing into the Canvas
    tlSequence.to("#video-wrapper", {
        scale: 1.15,
        duration: 1,
        ease: "power1.inOut"
    }, 0);

    // 4. Specs Section Animations (Dobra 2)
    gsap.from("#specs-text > *", {
        scrollTrigger: {
            trigger: "#specs-section",
            start: "top 75%", // Triggers when the section comes into view
        },
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out"
    });

    gsap.from("#specs-card", {
        scrollTrigger: {
            trigger: "#specs-section",
            start: "top 75%",
        },
        x: 100,
        y: 50,
        opacity: 0,
        rotationY: 20,
        scale: 0.95,
        duration: 1.8,
        ease: "power3.out"
    });
    
    // Continuous floating animation on specs image
    gsap.to("#specs-image", { y: -20, rotationZ: 1, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });

    // 5. Bento Section Animations (Dobra 3)
    gsap.from("#bento-header > *", {
        scrollTrigger: {
            trigger: "#bento-section",
            start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out"
    });

    gsap.from(".bento-card", {
        scrollTrigger: {
            trigger: "#bento-section",
            start: "top 70%",
        },
        y: 60,
        opacity: 0,
        scale: 0.96,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out"
    });

    // =========================================================
    // 6. RITUAL SECTION (Dobra 3) — timeline horizontal + stats
    // =========================================================

    // Opener (entrada suave)
    gsap.from("#ritual-opener > *", {
        scrollTrigger:{ trigger:"#ritual-section", start:"top 75%" },
        y:60, opacity:0, duration:1.2, stagger:0.15, ease:"power4.out"
    });

    // Pin + horizontal scroll dos 6 steps
    const ritualSteps = document.getElementById("ritualSteps");
    const ritualWrapper = document.getElementById("ritual-track-wrapper");
    const stepEls = gsap.utils.toArray(".ritual-step");
    if(ritualSteps && stepEls.length){
        // Distancia horizontal total: largura total menos viewport
        const getDistance = () => {
            return Math.max(0, ritualSteps.scrollWidth - window.innerWidth + 48); // pequena folga
        };

        let horizontalTween = gsap.to(ritualSteps, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
                trigger: ritualWrapper,
                start: "top top",
                end: () => "+=" + (getDistance() + window.innerHeight * 0.2),
                scrub: 1.1,
                pin: "#ritual-pin",
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const p = self.progress;
                    const progressEl = document.getElementById("ritualProgress");
                    if(progressEl) progressEl.style.width = (p*100).toFixed(1) + "%";
                    // Step ativo (com pequeno offset para reagir antes do centro)
                    const idx = Math.min(stepEls.length - 1, Math.floor(p * stepEls.length));
                    const el = stepEls[idx];
                    if(el){
                        const num = el.dataset.step || "01";
                        const name = el.dataset.name || "";
                        const nEl = document.getElementById("ritualStepNum");
                        const nNm = document.getElementById("ritualStepName");
                        if(nEl) nEl.textContent = num;
                        if(nNm) nNm.textContent = name;
                    }
                    stepEls.forEach((s,i)=> s.classList.toggle("is-active", i === idx));
                }
            }
        });

        // Parallax sutil nas cartas — flutuam dentro da track enquanto passam
        stepEls.forEach((card, i)=>{
            gsap.fromTo(card.firstElementChild,
                { y: 40, opacity: 0, scale: .96 },
                { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out",
                  scrollTrigger:{ trigger: card, containerAnimation: horizontalTween, start:"left 85%" }
                }
            );
        });
    }

    // Cartela dos Mestres — cabecalho
    gsap.from("#cartelaHeader > *", {
        scrollTrigger:{ trigger:"#cartelaHeader", start:"top 80%" },
        y:40, opacity:0, duration:1.2, stagger:0.12, ease:"power4.out"
    });

    // Cards — reveal em stagger com blur e rotacao sutil
    gsap.utils.toArray(".material-card").forEach((card, i)=>{
        gsap.fromTo(card,
            { opacity:0, y:60, scale:.94, filter:"blur(12px)", rotationX:-8 },
            { opacity:1, y:0, scale:1, filter:"blur(0px)", rotationX:0,
              duration:1.3, ease:"expo.out", delay:(i%3)*0.12,
              scrollTrigger:{ trigger:card, start:"top 85%", toggleActions:"play none none none" }
            }
        );
    });

    // Tilt 3D com mouse em cada card
    gsap.utils.toArray(".material-card[data-tilt]").forEach(card=>{
        const shell = card.querySelector(".mc-shell");
        card.addEventListener("mousemove", (e)=>{
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left)/r.width - 0.5;
            const py = (e.clientY - r.top)/r.height - 0.5;
            gsap.to(shell, {
                rotationY: px*8, rotationX: -py*6,
                transformPerspective:1000,
                duration:.8, ease:"power3.out"
            });
        });
        card.addEventListener("mouseleave", ()=>{
            gsap.to(shell, { rotationY:0, rotationX:0, duration:1, ease:"power3.out" });
        });
    });

    // Rodape editorial (CTA) — entrada em blur
    gsap.from("#cartelaRodape", {
        scrollTrigger:{ trigger:"#cartelaRodape", start:"top 85%" },
        opacity:0, y:60, filter:"blur(14px)",
        duration:1.4, ease:"expo.out"
    });

    // 7. Outro Reveal Animation
    gsap.from("#outro-content", {
        scrollTrigger: {
            trigger: "#outro-content",
            start: "top 85%",
        },
        y: 100,
        opacity: 0,
        scale: 0.95,
        duration: 1.5,
        ease: "power4.out"
    });

    // ==================================================
    // Toast "Mais informacoes em breve"
    // Qualquer [data-soon] aciona o toast flutuante
    // ==================================================
    const toast = document.getElementById("toastSoon");
    let toastTimer;
    function showToast(){
        if(!toast) return;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(()=> toast.classList.remove("show"), 2800);
    }
    document.querySelectorAll("[data-soon]").forEach(el=>{
        el.addEventListener("click", (e)=>{
            e.preventDefault();
            showToast();
        });
    });

    // ==================================================
    // Smooth scroll nos links âncora (integrado com Lenis)
    // ==================================================
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
        const href = a.getAttribute("href");
        if(href === "#" || a.hasAttribute("data-soon")) return;
        const target = document.querySelector(href);
        if(!target) return;
        a.addEventListener("click", (e)=>{
            e.preventDefault();
            lenis.scrollTo(target, { offset:-80, duration:1.4 });
        });
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
        // Optionally adjust canvas logic on hard resize if needed.
        // Currently hRatio/vRatio scales correctly on browser frame.
    });
});
