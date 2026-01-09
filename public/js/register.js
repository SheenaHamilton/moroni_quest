// public/js/registration-form.js
// Handles:
// - Registration type toggle (youth vs leader)
// - Conditional panels (diet, allergies, meds, self-administer, conditions, surgery, lodging)
// - Optional: scroll to top error block when present

(() => {
    function init() {
        const form = document.getElementById("registration-form");
        if (!form) return;

        if (form.dataset.jsInitialized === "true") return;

        form.dataset.jsInitialized = "true";

        const qs = (sel, root = document) => root.querySelector(sel);
        const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

        const youthSection = qs(".reg-card--youth", form);
        const leaderSection = qs(".reg-card--leader", form);

        const panels = {
            diet: qs("#diet-details", form),
            allergies: qs("#allergies-details", form),
            medications: qs("#medications-details", form),
            "self-administer": qs("#administer-details", form),
            "health-conditions": qs("#health-conditions-details", form),
            surgery: qs("#surgery-details", form),
            lodging: qs("#lodging-details", form),
        };

        function setHidden(el, hidden) {
            if (!el) return;
            el.classList.toggle("is-hidden", hidden);
            el.setAttribute("aria-hidden", String(hidden));
        }

        function initConditionalPanelsForVisibleSections() {
            // only look at enabled radios (active section)
            qsa("input[type='radio'][data-toggle][data-toggle-value]", form)
                .filter((r) => !r.disabled && r.checked)
                .forEach(handleToggleInput);

            const lodgingSelect = qs('select[data-toggle="lodging"]', form);
            if (lodgingSelect && !lodgingSelect.disabled) handleLodgingSelect(lodgingSelect);
        }

        // Only toggle required on fields explicitly marked for conditional requirement
        function setConditionalRequiredInside(el, required) {
            if (!el) return;
            qsa("[data-req-when-visible]", el).forEach((c) => {
                c.required = !!required;
            });
        }

        // Disable hidden sections so required fields don't block submit and values aren't submitted
        function disableControlsInside(el, disabled) {
            if (!el) return;
            qsa("input, select, textarea, button", el).forEach((c) => {
                if (c.type === "submit") return;
                c.disabled = !!disabled;
            });
        }

        function resetValuesInside(el) {
            if (!el) return;
            qsa("input, textarea, select", el).forEach((c) => {
                if (c.type === "radio" || c.type === "checkbox") c.checked = false;
                else if (c.tagName === "SELECT") c.selectedIndex = 0;
                else c.value = "";
            });
        }

        // --- Youth vs Leader toggle ---
        function applyRegistrationType(type, { resetOther = false } = {}) {
            const isYouth = type === "youth";
            const isLeader = type === "leader";

            setHidden(youthSection, !isYouth);
            setHidden(leaderSection, !isLeader);

            disableControlsInside(youthSection, !isYouth);
            disableControlsInside(leaderSection, !isLeader);

            // Only clear the other side if user is switching types
            if (resetOther) {
                if (isYouth && leaderSection) resetValuesInside(leaderSection);
                if (isLeader && youthSection) resetValuesInside(youthSection);
            }
        }

        // --- Conditional panels ---
        function showPanel(key, show) {
            const panel = panels[key];
            if (!panel) return;

            setHidden(panel, !show);
            setConditionalRequiredInside(panel, show);

            if (!show) resetValuesInside(panel);
        }

        function handleToggleInput(target) {
            const key = target.getAttribute("data-toggle");
            const val = target.getAttribute("data-toggle-value");
            if (!key || !val) return;

            showPanel(key, val === "yes");
        }

        function handleLodgingSelect(target) {
            if (!target.matches('select[data-toggle="lodging"]')) return;
            const v = target.value;
            showPanel("lodging", !!v && v !== "tent");
        }

        // --- Event listeners (Safari-safe) ---
        function handleAnyEvent(e) {
            const t = e.target;

            if (t.matches('input[name="registration_type"]')) {
                applyRegistrationType(t.value, { resetOther: true });
                initConditionalPanelsForVisibleSections();
                return;
            }

            if (t.matches("input[type='radio'][data-toggle][data-toggle-value]")) {
                handleToggleInput(t);
                return;
            }

            if (t.matches('select[data-toggle="lodging"]')) {
                handleLodgingSelect(t);
                return;
            }
        }

        // Use multiple event types for mobile browser reliability
        form.addEventListener("change", handleAnyEvent);

        // --- Initialize state on first load / restore ---
        // Ensure there's a default selection (you set Youth checked in HTML, but browsers can be weird)
        const youthDefault = qs('input[name="registration_type"][value="youth"]', form);
        const checkedType = qs('input[name="registration_type"]:checked', form);

        if (!checkedType && youthDefault) youthDefault.checked = true;

        const initialType = qs('input[name="registration_type"]:checked', form)?.value;

        if (initialType) {
            applyRegistrationType(initialType, { resetOther: false });
        } else {
            if (youthSection) { setHidden(youthSection, true); disableControlsInside(youthSection, true); }
            if (leaderSection) { setHidden(leaderSection, true); disableControlsInside(leaderSection, true); }
        }

        // NOW initialize panels based on currently-enabled inputs
        initConditionalPanelsForVisibleSections();

        // --- Scroll to error block ONLY when it exists and is flagged ---
        const errorBlock = document.getElementById("reg-error-block");
        if (errorBlock && errorBlock.dataset.scrollOnLoad === "true") {
            const offset = 140; // pixels above the element
            const y = errorBlock.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({ top: y, behavior: "smooth" });

        }
    }

    // Run on first load
    document.addEventListener("DOMContentLoaded", init);

    // Safari/iOS: run again when page is restored from bfcache
    window.addEventListener("pageshow", init);

    document.addEventListener("DOMContentLoaded", () => {
        const permissionCheckbox = document.getElementById("permission_granted");
        const dateInput = document.getElementById("permission_date");

        if (!permissionCheckbox || !dateInput) return;

        permissionCheckbox.addEventListener("change", () => {
            // Only set if checked AND date is empty
            if (!permissionCheckbox.checked || dateInput.value) return;

            const d = new Date();
            d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); // Safari-safe
            dateInput.value = d.toISOString().split("T")[0];
        });
    });

})();

(() => {
    function scrollToErrorIfNeeded() {
        const errorBlock = document.getElementById("reg-error-block");
        if (!errorBlock) return;
        if (errorBlock.dataset.scrollOnLoad !== "true") return;

        const offset = 140;

        // Wait until layout is stable (Safari/Firefox friendly)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const y =
                    errorBlock.getBoundingClientRect().top +
                    window.pageYOffset -
                    offset;

                window.scrollTo({ top: y, behavior: "smooth" });
            });
        });
    }

    function initOnce() {
        const form = document.getElementById("registration-form");
        if (!form) return;

        if (form.dataset.jsInitialized === "true") return;
        form.dataset.jsInitialized = "true";

        // ... ALL your existing init logic EXCEPT the scroll block ...
        // (listeners, applyRegistrationType, initConditionalPanelsForVisibleSections, etc.)
    }

    document.addEventListener("DOMContentLoaded", () => {
        initOnce();
        scrollToErrorIfNeeded();
    });

    window.addEventListener("pageshow", (e) => {
        // On bfcache restore, DOM is already there; initOnce will likely no-op (good),
        // but we still WANT to scroll if flagged.
        scrollToErrorIfNeeded();
    });

    // (keep your permission_date DOMContentLoaded handler as-is)
})();