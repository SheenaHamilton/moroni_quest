// public/js/registration-form.js
// Handles:
// - Registration type toggle (youth vs leader)
// - Conditional panels (diet, allergies, meds, self-administer, conditions, surgery, lodging)
// Requires:
// - Youth section has class .reg-card--youth
// - Leader section has class .reg-card--leader
// - Conditional panels have IDs: diet-details, allergies-details, medications-details, administer-details,
//   health-conditions-details, surgery-details, lodging-details
// - Conditional radios use: data-toggle + data-toggle-value ("yes"/"no")
// - Lodging select uses: data-toggle="lodging"
// - Fields that should become required when a panel is visible have: data-req-when-visible

(() => {
    const form = document.getElementById("registration-form");
    if (!form) return;

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
    function applyRegistrationType(type) {
        const isYouth = type === "youth";
        const isLeader = type === "leader";

        setHidden(youthSection, !isYouth);
        setHidden(leaderSection, !isLeader);

        // Prevent hidden section inputs from being submitted/validated
        disableControlsInside(youthSection, !isYouth);
        disableControlsInside(leaderSection, !isLeader);

        // Clear hidden section values to avoid stale data submission
        if (isYouth && leaderSection) resetValuesInside(leaderSection);
        if (isLeader && youthSection) resetValuesInside(youthSection);
    }

    // --- Conditional panels (Yes/No radios & lodging select) ---
    function showPanel(key, show) {
        const panel = panels[key];
        if (!panel) return;

        setHidden(panel, !show);

        // Only require fields inside the panel when it’s shown
        setConditionalRequiredInside(panel, show);

        // If hiding, clear values so they don’t submit accidentally
        if (!show) resetValuesInside(panel);
    }

    function handleToggleInput(target) {
        const key = target.getAttribute("data-toggle");
        const val = target.getAttribute("data-toggle-value");
        if (!key || !val) return;

        // Our pattern uses yes/no radios
        showPanel(key, val === "yes");
    }

    function handleLodgingSelect(target) {
        if (!target.matches('select[data-toggle="lodging"]')) return;
        const v = target.value;
        showPanel("lodging", !!v && v !== "tent");
    }

    // --- Event listeners ---
    form.addEventListener("change", (e) => {
        const t = e.target;

        // Registration type
        if (t.matches('input[name="registration_type"]')) {
            applyRegistrationType(t.value);
            return;
        }

        // Yes/No radios with data-toggle attributes
        if (t.matches("input[type='radio'][data-toggle][data-toggle-value]")) {
            handleToggleInput(t);
            return;
        }

        // Lodging dropdown
        handleLodgingSelect(t);
    });

    // --- Initialize state (in case browser restores values) ---
    const initialType = qs('input[name="registration_type"]:checked', form)?.value;
    if (initialType) {
        applyRegistrationType(initialType);
    } else {
        // Default: keep both hidden/disabled until user chooses
        if (youthSection) {
            setHidden(youthSection, true);
            disableControlsInside(youthSection, true);
        }
        if (leaderSection) {
            setHidden(leaderSection, true);
            disableControlsInside(leaderSection, true);
        }
    }

    // Initialize conditional panels based on any pre-checked radios/selects
    qsa("input[type='radio'][data-toggle][data-toggle-value]:checked", form).forEach(handleToggleInput);

    const lodgingSelect = qs('select[data-toggle="lodging"]', form);
    if (lodgingSelect) handleLodgingSelect(lodgingSelect);
})();
