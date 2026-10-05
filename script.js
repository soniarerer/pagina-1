/* =========================================================
   PEQUEÑOS DETALLES DE TI
   SCRIPT.JS
   Navegación + animaciones + música + efectos
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    var screens = document.querySelectorAll(".screen");
    var progressFill = document.getElementById("progressFill");
    var progressText = document.getElementById("progressText");
    var music = document.getElementById("music");
    var musicButton = document.getElementById("musicButton");

    var currentSection = 0;
    var musicPlaying = false;
    var totalSections = screens.length;

    function updateProgress() {
        if (!progressFill || !progressText) {
            return;
        }

        var percentage = ((currentSection + 1) / totalSections) * 100;
        progressFill.style.width = percentage + "%";
        progressText.textContent = (currentSection + 1) + " / " + totalSections;
    }

    function showSection(index) {
        if (index < 0) { index = 0; }
        if (index >= totalSections) { index = totalSections - 1; }

        screens.forEach(function (screen, i) {
            screen.classList.remove("active");
            if (i === index) {
                screen.classList.add("active");
            }
        });

        currentSection = index;
        updateProgress();
        animateCurrentSection();
    }

    function nextSection() {
        if (currentSection < totalSections - 1) {
            showSection(currentSection + 1);
        }
    }

    function previousSection() {
        if (currentSection > 0) {
            showSection(currentSection - 1);
        }
    }

    function animateCurrentSection() {
        var currentScreen = screens[currentSection];
        if (!currentScreen) {
            return;
        }

        var elements = currentScreen.querySelectorAll(
            ".photo-small, .photo-container, .number, .category, h1, h2, .message, .intro-text, .main-button, .next-button, .final-heart, .signature"
        );

        elements.forEach(function (element, index) {
            element.animate(
                [
                    { opacity: 0, transform: "translateY(18px) scale(0.97)" },
                    { opacity: 1, transform: "translateY(0) scale(1)" }
                ],
                {
                    duration: 650,
                    delay: index * 70,
                    easing: "cubic-bezier(.22,1,.36,1)",
                    fill: "both"
                }
            );
        });
    }

    function restartPage() {
        showSection(0);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function updateMusicButton(isPlaying) {
        if (!musicButton) {
            return;
        }

        if (isPlaying) {
            musicButton.textContent = "♫";
            musicButton.setAttribute("aria-label", "Pausar música");
            musicButton.style.animation = "musicPulse 1.5s ease-in-out infinite";
        } else {
            musicButton.textContent = "♪";
            musicButton.setAttribute("aria-label", "Reproducir música");
            musicButton.style.animation = "none";
        }
    }

    function setupKeyboardNavigation() {
        document.addEventListener("keydown", function (event) {
            var tag = document.activeElement && document.activeElement.tagName;

            if (event.key === "ArrowRight" || event.key === " " || event.key === "Enter") {
                if (tag === "INPUT" || tag === "TEXTAREA") {
                    return;
                }

                event.preventDefault();
                nextSection();
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                previousSection();
            }

            if (event.key === "Escape") {
                showSection(0);
            }
        });
    }

    function setupTouchNavigation() {
        var startX = 0;
        var endX = 0;
        var minimumSwipe = 60;

        document.addEventListener("touchstart", function (event) {
            startX = event.changedTouches[0].screenX;
        }, { passive: true });

        document.addEventListener("touchend", function (event) {
            endX = event.changedTouches[0].screenX;
            var difference = endX - startX;

            if (Math.abs(difference) < minimumSwipe) {
                return;
            }

            if (difference < 0) {
                nextSection();
            } else {
                previousSection();
            }
        }, { passive: true });
    }

    function createFloatingParticles() {
        var particleContainer = document.createElement("div");
        particleContainer.className = "floating-particles";
        particleContainer.setAttribute("aria-hidden", "true");
        document.body.appendChild(particleContainer);

        var particleCount = window.innerWidth < 600 ? 12 : 22;

        for (var i = 0; i < particleCount; i++) {
            var particle = document.createElement("span");
            particle.className = "floating-particle";

            var size = Math.random() * 5 + 2;
            var left = Math.random() * 100;
            var duration = Math.random() * 10 + 8;
            var delay = Math.random() * 10;

            particle.style.width = size + "px";
            particle.style.height = size + "px";
            particle.style.left = left + "%";
            particle.style.animationDuration = duration + "s";
            particle.style.animationDelay = delay + "s";

            particleContainer.appendChild(particle);
        }
    }

    function createAudioContext() {
        if (!window.__audioContext) {
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                window.__audioContext = new AudioContext();
            }
        }
    }

    function playSoftClick() {
        try {
            createAudioContext();
            if (!window.__audioContext) {
                return;
            }

            var oscillator = window.__audioContext.createOscillator();
            var gain = window.__audioContext.createGain();
            oscillator.type = "sine";
            oscillator.frequency.value = 520;
            gain.gain.setValueAtTime(0.0001, window.__audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.025, window.__audioContext.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, window.__audioContext.currentTime + 0.12);
            oscillator.connect(gain);
            gain.connect(window.__audioContext.destination);
            oscillator.start();
            oscillator.stop(window.__audioContext.currentTime + 0.13);
        } catch (error) {
            // Safari u otros navegadores pueden bloquearlo, pero la página sigue funcionando.
        }
    }

    function createFinalSparkles() {
        var finalScreen = document.getElementById("final");
        if (!finalScreen) {
            return;
        }

        for (var i = 0; i < 14; i++) {
            var sparkle = document.createElement("span");
            sparkle.className = "final-sparkle";
            sparkle.textContent = "✦";
            sparkle.style.left = (Math.random() * 90 + 5) + "%";
            sparkle.style.top = (Math.random() * 80 + 10) + "%";
            sparkle.style.animationDelay = (Math.random() * 3) + "s";
            finalScreen.appendChild(sparkle);
        }
    }

    function setFallbackImages() {
        document.querySelectorAll("img").forEach(function (img) {
            img.addEventListener("error", function () {
                if (this.dataset.fallbackApplied === "true") {
                    return;
                }
                this.dataset.fallbackApplied = "true";
                this.src = "img/foto.svg";
            });
        });
    }

    window.showSection = showSection;
    window.previousSection = previousSection;
    window.restartPage = restartPage;

    window.nextSection = function () {
        playSoftClick();
        nextSection();
    };

    window.toggleMusic = function () {
        if (!music) {
            return;
        }

        if (musicPlaying) {
            music.pause();
            musicPlaying = false;
            updateMusicButton(false);
        } else {
            music.play().then(function () {
                musicPlaying = true;
                updateMusicButton(true);
            }).catch(function () {
                musicPlaying = false;
                updateMusicButton(false);
            });
        }
    };

    updateProgress();
    createFloatingParticles();
    setupKeyboardNavigation();
    setupTouchNavigation();
    setFallbackImages();
    createFinalSparkles();

    document.addEventListener("mousemove", function (event) {
        var x = (event.clientX / window.innerWidth) * 100;
        var y = (event.clientY / window.innerHeight) * 100;
        document.body.style.setProperty("--mouse-x", x + "%");
        document.body.style.setProperty("--mouse-y", y + "%");
    });

    document.addEventListener("dragstart", function (event) {
        if (event.target.tagName === "IMG") {
            event.preventDefault();
        }
    });

    var lastTouchEnd = 0;
    document.addEventListener("touchend", function (event) {
        var now = Date.now();

        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }

        lastTouchEnd = now;
    }, { passive: false });

    var dynamicStyle = document.createElement("style");
    dynamicStyle.textContent = [
        ".floating-particles { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: -1; }",
        ".floating-particle { position: absolute; bottom: -20px; display: block; border-radius: 50%; background: rgba(255, 190, 215, 0.5); box-shadow: 0 0 12px rgba(255, 170, 205, 0.35); animation: particleFloat linear infinite; }",
        "@keyframes particleFloat { 0% { transform: translateY(0) translateX(0) scale(0.5); opacity: 0; } 10% { opacity: 0.8; } 50% { transform: translateY(-50vh) translateX(20px) scale(1); } 100% { transform: translateY(-110vh) translateX(-25px) scale(0.3); opacity: 0; } }",
        "@keyframes musicPulse { 0%, 100% { box-shadow: 0 0 0 rgba(255,160,200,0); } 50% { box-shadow: 0 0 22px rgba(255,160,200,0.3); } }",
        ".final-sparkle { position: absolute; color: rgba(255,210,230,0.55); font-size: 10px; pointer-events: none; animation: sparkleAnimation 3s ease-in-out infinite; }",
        "@keyframes sparkleAnimation { 0%, 100% { opacity: 0.1; transform: scale(0.5) rotate(0deg); } 50% { opacity: 0.9; transform: scale(1.2) rotate(90deg); } }",
        "body::after { background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,180,210,0.08), transparent 30%); transition: background 0.2s ease; }"
    ].join("\n");

    document.head.appendChild(dynamicStyle);

    setTimeout(function () {
        animateCurrentSection();
    }, 250);
});
