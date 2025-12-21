document.addEventListener("DOMContentLoaded", () => {
    const cards = Array.from(document.querySelectorAll(".bomCard"));
    const dots = Array.from(document.querySelectorAll(".bom__dot"));

    const prev = document.getElementById("prevWeek");
    const next = document.getElementById("nextWeek");
    const label = document.getElementById("weekLabel");
    const viewport = document.querySelector(".bom__viewport");

    if (!cards.length || !prev || !next || !label || !viewport) {
        console.warn("BOM carousel: missing elements.");
        return;
    }

    let index = 0;

    function render() {
        cards.forEach((c, i) => c.classList.toggle("is-active", i === index));
        dots.forEach((d, i) => d.classList.toggle("is-active", i === index));

        const wk = cards[index].dataset.week || String(index + 1);
        label.textContent = `Week ${wk}`;

        // Helpful for screen readers
        viewport.setAttribute(
            "aria-label",
            `Weekly challenges. Showing Week ${wk}. Use left/right arrow keys to navigate.`
        );

        const carousel = document.getElementById("bom-challenge-carousel");
        const bg = cards[index].dataset.bg;

        if (bg) {
            carousel.style.setProperty(
                "--carousel-bg",
                `url("${bg}")`
            );
        }

    }

    function go(delta) {
        index = (index + delta + cards.length) % cards.length;
        render();
    }

    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            index = i;
            render();
        });
    });

    // ✅ Keyboard support (when viewport has focus)
    viewport.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(-1);
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            go(1);
        }
    });

    // ✅ Swipe support (touch)
    let startX = 0;
    let startY = 0;
    let tracking = false;

    viewport.addEventListener(
        "touchstart",
        (e) => {
            if (!e.touches || e.touches.length !== 1) return;
            tracking = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        },
        { passive: true }
    );

    viewport.addEventListener(
        "touchend",
        (e) => {
            if (!tracking) return;
            tracking = false;

            const t = e.changedTouches && e.changedTouches[0];
            if (!t) return;

            const dx = t.clientX - startX;
            const dy = t.clientY - startY;

            // prevent accidental swipe during vertical scroll
            if (Math.abs(dx) < 40) return;
            if (Math.abs(dx) < Math.abs(dy)) return;

            // swipe left = next, swipe right = prev
            if (dx < 0) go(1);
            else go(-1);
        },
        { passive: true }
    );

    render();
});
