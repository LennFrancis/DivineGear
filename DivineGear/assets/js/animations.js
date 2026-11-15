// Animate product cards when they appear on the page.
function animateProductCards() {
    if (typeof gsap !== "undefined") {
        gsap.from(".product-card, .featured-item", {
            opacity: 0,
            y: 25,
            duration: 3,
            stagger: 0.08
        });
    }
}