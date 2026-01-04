document.addEventListener('DOMContentLoaded', () => {
    // Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');

            // Hamburger animation or text change could go here
            if (!isExpanded) {
                navToggle.innerHTML = '&times;'; // Simple close icon
            } else {
                navToggle.innerHTML = '&#9776;'; // Hamburger
            }
        });
    }

    // Smooth scroll for anchor links (fallback for Safari older versions if needed, mainly implies active state)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.innerHTML = '<span style="font-size: 1.5rem;">&#9776;</span>';
                }

                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Fade in elements
    const fadeElements = document.querySelectorAll('.project-card, .skill-card, .about-text');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
        observer.observe(el);
    });

    // Timeline Animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }

    // Mouse Parallax Animation for Hero
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;

            document.querySelectorAll('[data-speed]').forEach(el => {
                const speed = el.getAttribute('data-speed');
                const xOffset = x * speed * 50;
                const yOffset = y * speed * 50;

                el.style.transform = `translateX(${xOffset}px) translateY(${yOffset}px)`;
            });
        });

        // Reset on mouse leave
        heroSection.addEventListener('mouseleave', () => {
            document.querySelectorAll('[data-speed]').forEach(el => {
                el.style.transform = `translateX(0) translateY(0)`;
                el.style.transition = 'transform 0.5s ease-out';
            });
        });

        // Remove transition during movement for smoothness
        heroSection.addEventListener('mouseenter', () => {
            document.querySelectorAll('[data-speed]').forEach(el => {
                el.style.transition = 'none';
            });
        });
    }

    // Floating Dock Animation (Aceternity Style)
    const socialDeck = document.querySelector('.social-deck');
    const socialIcons = document.querySelectorAll('.social-icon');

    if (socialDeck && socialIcons.length > 0) {
        // Configuration
        const baseWidth = 3; // rem
        const maxScale = 1.8; // Max multiplier
        const distanceRange = 150; // px radius for effect effect

        socialDeck.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;

            socialIcons.forEach(icon => {
                const rect = icon.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const distance = Math.abs(mouseX - centerX);

                let scale = 1;

                if (distance < distanceRange) {
                    // Calculate scale based on cosine curve for smooth falloff
                    // Normalized distance (0 to 1)
                    const normalizedDist = distance / distanceRange;
                    // Cosine interpolation: (cos(dist * pi) + 1) / 2 goes from 1 to 0
                    // We want it to go from maxScale to 1

                    // Simpler linear-ish or sine approach:
                    // scale = 1 + (maxScale - 1) * (1 - normalizedDist); 

                    // Cosine approach for smoother bell curve
                    const curve = Math.cos(normalizedDist * Math.PI / 2); // 1 at 0, 0 at 1
                    scale = 1 + (maxScale - 1) * curve;
                }

                // Apply scale to width and height
                icon.style.width = `${baseWidth * scale}rem`;
                icon.style.height = `${baseWidth * scale}rem`;
                // icon.style.fontSize = `${1 * scale}rem`; // If using font icons
            });
        });

        socialDeck.addEventListener('mouseleave', () => {
            socialIcons.forEach(icon => {
                icon.style.width = `${baseWidth}rem`;
                icon.style.height = `${baseWidth}rem`;
                // Add explicit transition to smooth out the reset
                icon.style.transition = 'width 0.3s ease, height 0.3s ease';

                // Remove transition after it's done so mousemove is snappy
                setTimeout(() => {
                    icon.style.transition = 'color 0.2s ease, background-color 0.2s ease';
                }, 300);
            });
        });

        socialDeck.addEventListener('mouseenter', () => {
            socialIcons.forEach(icon => {
                // Remove transition for snappy interaction
                icon.style.transition = 'none';
            });
        });
    }
    // Project Slider Logic
    const slider = document.querySelector('.projects-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (slider && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const cardWidth = slider.querySelector('.project-card').offsetWidth + 32; // card + gap
            slider.scrollBy({
                left: -cardWidth,
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            const cardWidth = slider.querySelector('.project-card').offsetWidth + 32; // card + gap
            slider.scrollBy({
                left: cardWidth,
                behavior: 'smooth'
            });
        });
    }

    // Project Details Data
    const projectDetails = {
        finance: {
            title: "Finance Tracker App",
            tags: ["SwiftUI", "CoreData", "Combine"],
            image: "assets/images/finance_app.png",
            description: `
                <h4>Overview</h4>
                <p>A comprehensive personal finance application designed to help users track their spending habits, set budgets, and visualize their financial health. Built entirely with SwiftUI, it leverages CoreData for robust local persistence.</p>
                
                <h4>Key Features</h4>
                <ul>
                    <li><strong>Intuitive Dashboard:</strong> Real-time overview of monthly spending and remaining budget.</li>
                    <li><strong>Data Visualization:</strong> Interactive charts and graphs using Swift Charts to analyze trends over time.</li>
                    <li><strong>Smart Categorization:</strong> Automatic categorization of expenses with machine learning suggestions.</li>
                    <li><strong>Cloud Sync:</strong> (In Progress) iCloud sync using NSPersistentCloudKitContainer.</li>
                </ul>

                <h4>Technical Challenges</h4>
                <p>One of the main challenges was optimizing the CoreData fetch requests to ensure smooth scrolling in the transaction list, even with thousands of entries. Implementing \`NSFetchedResultsController\` with diffable data sources provided the seamless performance required.</p>
            `,
            links: {
                github: "https://github.com/example/finance-tracker",
                playstore: "https://play.google.com/store/apps/details?id=com.example.finance",
                appstore: "https://apps.apple.com/app/id123456789"
            }
        },
        social: {
            title: "Social Connect",
            tags: ["React Native", "Firebase", "Redux"],
            image: "assets/images/social_app.png",
            description: `
                <h4>Overview</h4>
                <p>Social Connect is a real-time networking platform connecting professionals in the creative industry. It features instant messaging, portfolio sharing, and event discovery.</p>
                
                <h4>Key Features</h4>
                <ul>
                    <li><strong>Real-time Chat:</strong> Instant messaging powered by Firebase Firestore and Cloud Functions.</li>
                    <li><strong>Media Sharing:</strong> High-quality image and video uploads with optimized compression.</li>
                    <li><strong>Geolocation:</strong> Discover local networking events and meetups nearby.</li>
                </ul>

                <h4>Technical Highlights</h4>
                <p>Utilized React Native Reanimated for buttery smooth 60fps animations. Implemented offline support so users can access their chats and feed even without an active internet connection.</p>
            `,
            links: {
                github: "https://github.com/example/social-connect",
                playstore: "https://play.google.com/store/apps/details?id=com.example.social",
                appstore: "https://apps.apple.com/app/id987654321"
            }
        },
        ecommerce: {
            title: "ShopMobile",
            tags: ["Flutter", "Stripe", "Bloc"],
            image: "", // Placeholder will be handled
            isPlaceholder: true,
            placeholderText: "E-Commerce App",
            description: `
                <h4>Overview</h4>
                <p>A seamless mobile shopping experience offering users a clean interface to browse products, manage carts, and securely checkout using Stripe.</p>
                
                <h4>Key Features</h4>
                <ul>
                    <li><strong>Product Discovery:</strong> Advanced filtering and search capabilities.</li>
                    <li><strong>Secure Payments:</strong> Integrated Stripe payment gateway for safe transactions.</li>
                    <li><strong>Order Tracking:</strong> Real-time updates on order status and delivery.</li>
                </ul>
            `,
            links: {
                github: "https://github.com/example/shopmobile",
                playstore: "https://play.google.com/store/apps/details?id=com.example.shop",
                appstore: "https://apps.apple.com/app/id555666777"
            }
        },
        health: {
            title: "HealthMate",
            tags: ["Kotlin", "HealthKit", "Jetpack Compose"],
            image: "", // Placeholder will be handled
            isPlaceholder: true,
            placeholderText: "Health & Fitness",
            description: `
                <h4>Overview</h4>
                <p>HealthMate is an activity tracking dashboard that integrates with wearable devices to provide actionable health insights. It aggregates data from various sources to give a holistic view of user wellness.</p>
                
                <h4>Key Features</h4>
                <ul>
                    <li><strong>Wearable Integration:</strong> Syncs with Apple Watch and Fitbit devices.</li>
                    <li><strong>Goal Setting:</strong> Customizable daily activity goals with progress rings.</li>
                    <li><strong>Sleep Analysis:</strong> Detailed breakdown of sleep stages and quality.</li>
                </ul>
            `,
            links: {
                github: "https://github.com/example/healthmate",
                playstore: "https://play.google.com/store/apps/details?id=com.example.health",
                appstore: "https://apps.apple.com/app/id999888777"
            }
        }
    };

    // Modal Logic
    const modal = document.getElementById('project-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalTags = document.getElementById('modal-tags');
    const modalImageContainer = document.getElementById('modal-image-container');
    const modalLinks = document.getElementById('modal-links');
    const modalDescription = document.getElementById('modal-description');
    const projectCards = document.querySelectorAll('.project-card');

    function openModal(projectId) {
        const data = projectDetails[projectId];
        if (!data) return;

        modalTitle.textContent = data.title;

        // Tags
        modalTags.innerHTML = data.tags.map(tag => `<span>${tag}</span>`).join('');

        // Image
        if (data.isPlaceholder) {
            modalImageContainer.innerHTML = `
                <div class="img-placeholder" style="width: 100%; height: 100%; background: linear-gradient(135deg, var(--bg-secondary), var(--bg-card)); display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 1.5rem; font-weight: 700; color: rgba(255,255,255,0.2);">${data.placeholderText}</span>
                </div>
            `;
        } else {
            modalImageContainer.innerHTML = `<img src="${data.image}" alt="${data.title}">`;
        }

        // Links
        let linksHtml = '';
        if (data.links) {
            // Updated to use btn-outline for all buttons as requested
            if (data.links.github) {
                linksHtml += `<a href="${data.links.github}" target="_blank" class="modal-btn btn-outline" aria-label="View Source on GitHub"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 0.5rem;"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>GitHub</a>`;
            }
            if (data.links.playstore) {
                linksHtml += `<a href="${data.links.playstore}" target="_blank" class="modal-btn btn-outline" aria-label="Download on Play Store"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 0.5rem;"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a.996.996 0 0 1 .609-.92zm11.565 11.564l1.848 1.848-6.9 3.978-2.614-2.614 7.666-3.212zm-4.32-4.32L8.24 6.444l6.9 3.979-1.848 1.847-2.438-3.212zm11.234.66l-4.524 2.611L15.93 12l1.634-1.634 4.524 2.61a.995.995 0 0 1 .001 1.699z"/></svg>Play Store</a>`;
            }
            if (data.links.appstore) {
                linksHtml += `<a href="${data.links.appstore}" target="_blank" class="modal-btn btn-outline" aria-label="Download on App Store"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 0.5rem;"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.68-.83 1.14-1.99 1.01-3.15-1.02.05-2.29.69-3.02 1.55-.63.75-1.18 1.95-1.02 3.09 1.14.09 2.33-.64 3.03-1.49z"/></svg>App Store</a>`;
            }
        }
        modalLinks.innerHTML = linksHtml;

        // Description
        modalDescription.innerHTML = data.description;

        // Show Modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Event Listeners
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent if clicking on specific buttons if needed, but card click is fine
            // If we had other interactive elements in the card, we might check e.target
            const id = card.getAttribute('data-id');
            if (id) openModal(id);
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close on background click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Typewriter Effect
    const typewriterElement = document.getElementById('typewriter-text');
    const emojiElement = document.getElementById('typewriter-emoji');

    if (typewriterElement && emojiElement) {
        const sentences = [
            { text: "Hello, I'm Devin De Silva", emoji: "👋", animation: "emoji-wave" },
            { text: "A Mobile Application Developer", emoji: "💻", animation: "emoji-bounce" },
            { text: "Based in London, UK", emoji: "📍", animation: "emoji-pop" }
        ];

        let sentenceIndex = 0;
        let charIndex = sentences[0].text.length; // Start fully typed
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentItem = sentences[sentenceIndex];
            const currentText = currentItem.text;

            // Sync Emoji Logic with Transition
            if (emojiElement.textContent !== currentItem.emoji && !isDeleting && charIndex === 0) {
                // Already handled in the delete finish block below
            }

            // Initial load check
            if (emojiElement.textContent === '' && sentenceIndex === 0) {
                emojiElement.textContent = currentItem.emoji;
                emojiElement.className = 'emoji-animate ' + currentItem.animation;
            }

            if (isDeleting) {
                typewriterElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50; // Deleting speed
            } else {
                typewriterElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100; // Typing speed
            }

            if (!isDeleting && charIndex === currentText.length) {
                // Finished typing sentence
                isDeleting = true;
                typeSpeed = 2000; // Wait before deleting
            } else if (isDeleting && charIndex === 0) {
                // Finished deleting sentence
                isDeleting = false;
                sentenceIndex = (sentenceIndex + 1) % sentences.length;
                typeSpeed = 500; // Wait before typing next

                // Trigger Emoji Transition
                const nextItem = sentences[sentenceIndex];

                // Add switching class to fade out
                emojiElement.classList.add('switching');

                // Wait for fade out, then swap and fade in
                setTimeout(() => {
                    emojiElement.textContent = nextItem.emoji;
                    // Reset class but keep base and new animation
                    emojiElement.className = 'emoji-animate ' + nextItem.animation + ' switching';

                    // Force reflow/small delay to ensure transition triggers
                    requestAnimationFrame(() => {
                        emojiElement.classList.remove('switching');
                    });
                }, 300); // Match CSS transition duration
            }

            setTimeout(type, typeSpeed);
        }

        // Start the loop with a delay
        setTimeout(() => {
            isDeleting = true; // Start by deleting the first sentence after delay
            setTimeout(type, 50);
        }, 3000);
    }

    // Contact Text Animation (Split into words)
    const animateText = document.querySelector('.animate-text');
    if (animateText) {
        const text = animateText.textContent;
        animateText.textContent = '';
        
        // Split by space but preserve spaces
        const words = text.split(' ');
        
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word + ' ';
            span.className = 'word';
            span.style.animationDelay = `${index * 0.1}s`; // Stagger delay
            animateText.appendChild(span);
        });

        // Observer for text
        const textObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const words = entry.target.querySelectorAll('.word');
                    words.forEach(word => word.classList.add('visible'));
                    textObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        textObserver.observe(animateText);
    }
});
