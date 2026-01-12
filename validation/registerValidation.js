const { body, validationResult } = require("express-validator");

const registerValidation = {};

const yesNoToBool = (v) => {
    if (typeof v !== "string") return v;
    const s = v.trim().toLowerCase();
    if (s === "yes") return true;
    if (s === "no") return false;
    return v;
};

// Checkbox values:
// - checked => "true" (string) OR "on" OR "true"
// - unchecked => undefined (missing)
const checkboxToBool = (v) => {
    if (v === undefined) return false;
    if (typeof v === "boolean") return v;
    const s = String(v).toLowerCase();
    return s === "true" || s === "on" || s === "1";
};

registerValidation.validateRegistration = () => {
    return [
        // --- Registration type ---
        body("registration_type")
            .trim()
            .notEmpty().withMessage("Registration type is required.")
            .isIn(["youth", "leader"]).withMessage("Registration type must be youth or leader."),

        // --- Shared participant info ---
        body("first_name")
            .trim()
            .notEmpty().withMessage("Participant Information: First name is required.")
            .isAlpha("en-US", { ignore: " -'" }).withMessage("Participant Information: First name must contain only letters."),

        body("last_name")
            .trim()
            .notEmpty().withMessage("Participant Information: Last name is required.")
            .isAlpha("en-US", { ignore: " -'" }).withMessage("Participant Information: Last name must contain only letters."),

        body("birthdate")
            .notEmpty().withMessage("Participant Information: Birthdate is required.")
            .isISO8601().withMessage("Participant Information: Birthdate must be a valid date.")
            .toDate(),

        body("gender")
            .trim()
            .notEmpty().withMessage("Participant Information: Gender is required.")
            .isIn(["male", "female"]).withMessage("Participant Information: Gender must be male or female."),

        body("email")
            .trim()
            .notEmpty().withMessage("Participant Information: Email is required.")
            .isEmail().withMessage("Participant Information: Must be a valid email address.")
            .normalizeEmail({ gmail_remove_dots: false }),

        body("ward")
            .trim()
            .notEmpty().withMessage("Participant Information: Ward / branch is required."),

        // --- Address (note: province mismatch fix below) ---
        body("address_street")
            .trim()
            .notEmpty().withMessage("Participant Information: Street Address is required."),

        body("address_city")
            .trim()
            .notEmpty().withMessage("Participant Information: City is required."),

        // OPTION A: enforce AB only (recommended)
        // body("address_province")
        //   .trim()
        //   .notEmpty().withMessage("Province is required.")
        //   .isIn(["AB"]).withMessage("Province must be AB.")
        //   .escape(),

        // OPTION B: accept "Alberta" or "AB" (works with your current form value)
        body("address_province")
            .trim()
            .notEmpty().withMessage("Participant Information: Province is required.")
            .customSanitizer((v) => {
                const s = String(v).trim().toLowerCase();
                if (s === "alberta") return "AB";
                if (s === "ab") return "AB";
                if (s === "saskatchewan") return "SK";
                if (s === "sk") return "SK";
                return v;
            })
            .isIn(["AB", "SK"]).withMessage("Participant Information: Province must be AB or SK."),

        body("address_postal")
            .trim()
            .notEmpty().withMessage("Participant Information: Postal code is required.")
            .matches(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/)
            .withMessage("Participant Information: Postal code must be a valid Canadian postal code."),

        // --- Emergency Contact ---
        body("emergency_contact_name")
            .trim()
            .notEmpty().withMessage("Emergency Contact: Emergency contact name is required."),

        body("emergency_contact_primary")
            .trim()
            .notEmpty().withMessage("Emergency Contact: Primary emergency contact phone is required.")
            .matches(/^[0-9\-+()\s]{7,20}$/).withMessage("Emergency Contact: Enter a valid phone number."),

        body("emergency_contact_secondary")
            .optional({ checkFalsy: true })
            .matches(/^[0-9\-+()\s]{7,20}$/).withMessage("Emergency Contact: Enter a valid secondary phone number."),

        // --- Health & dietary (shared) ---
        body("health_number")
            .trim()
            .notEmpty().withMessage("Health & Dietary: Health number is required."),

        body("diet_specific")
            .customSanitizer(yesNoToBool)
            .isBoolean().withMessage("Health & Dietary: Dietary needs selection is required.")
            .toBoolean(),

        body("diet_description")
            .optional({ checkFalsy: true })
            .trim(),

        body("allergies")
            .customSanitizer(yesNoToBool)
            .isBoolean().withMessage("Health & Dietary: Allergies selection is required.")
            .toBoolean(),

        body("allergies_description")
            .optional({ checkFalsy: true })
            .trim(),

        // Require diet_description if diet_specific === true
        body("diet_description").custom((value, { req }) => {
            if (req.body.diet_specific === true && (!value || !String(value).trim())) {
                throw new Error("Health & Dietary: Please describe dietary needs.");
            }
            return true;
        }),

        // Require allergies_description if allergies === true
        body("allergies_description").custom((value, { req }) => {
            if (req.body.allergies === true && (!value || !String(value).trim())) {
                throw new Error("Health & Dietary: Please list allergies.");
            }
            return true;
        }),

        // --- Youth-only fields ---
        body("medications")
            .customSanitizer(yesNoToBool)
            .optional()
            .toBoolean(),

        body("medications_self_administer")
            .customSanitizer(yesNoToBool)
            .optional()
            .toBoolean(),

        body("medications_description")
            .optional({ checkFalsy: true })
            .trim(),

        body("medications_administer_description")
            .optional({ checkFalsy: true })
            .trim(),

        body("health_conditions")
            .customSanitizer(yesNoToBool)
            .optional()
            .toBoolean(),

        body("health_conditions_description")
            .optional({ checkFalsy: true })
            .trim(),

        body("surgery_recent")
            .customSanitizer(yesNoToBool)
            .optional()
            .toBoolean(),

        body("surgery_description")
            .optional({ checkFalsy: true })
            .trim(),

        body("physical_limitations")
            .optional({ checkFalsy: true })
            .trim(),

        body("other_needs")
            .optional({ checkFalsy: true })
            .trim(),

        body("parent_guardian_name")
            .optional({ checkFalsy: true })
            .trim(),

        body("parent_guardian_relationship")
            .optional({ checkFalsy: true })
            .trim(),

        body("permission_granted")
            .customSanitizer(checkboxToBool)
            .optional()
            .toBoolean(),

        body("permission_granted_privilege")
            .customSanitizer(checkboxToBool)
            .optional()
            .toBoolean(),

        body("permission_date")
            .optional({ checkFalsy: true })
            .isISO8601().withMessage("Youth Medical & Permission: Permission date must be valid.")
            .toDate(),

        body("youth_acknowledgement_privilege")
            .customSanitizer(checkboxToBool)
            .optional()
            .toBoolean(),

        body("youth_acknowledgement")
            .optional({ checkFalsy: true })
            .isIn(["yes", "no"]).withMessage("Youth Medical & Permission: Youth acknowledgement must be yes or no."),

        // --- Leader-only fields ---
        body("role")
            .optional({ checkFalsy: true })
            .trim(),

        body("arrival_date")
            .optional({ checkFalsy: true })
            .isISO8601().withMessage("Leader Role & Lodging: Arrival date must be valid.")
            .toDate(),

        body("departure_date")
            .optional({ checkFalsy: true })
            .isISO8601().withMessage("Leader Role & Lodging: Departure date must be valid.")
            .toDate(),

        body("medical_background")
            .customSanitizer(yesNoToBool)
            .optional()
            .toBoolean(),

        body("medical_background_description")
            .optional({ checkFalsy: true })
            .trim(),

        body("lodging_type")
            .optional({ checkFalsy: true })
            .trim(),

        body("lodging_description")
            .optional({ checkFalsy: true })
            .trim(),

        // --- Terms & Media (checkboxes) ---
        body("media_consent_internal").customSanitizer(checkboxToBool).toBoolean(),
        body("media_consent_external").customSanitizer(checkboxToBool).toBoolean(),
        body("media_release_understood").customSanitizer(checkboxToBool).toBoolean(),
        body("terms_understood").customSanitizer(checkboxToBool).toBoolean(),


        // --- Cross-field conditional requirements by registration_type ---
        body().custom((_, { req }) => {
            const type = req.body.registration_type;

            if (type === "youth") {

                // Medication requirements if medications === true
                if (req.body.medications === true && !req.body.medications_description) {
                    throw new Error("Youth Medical & Permission: Please list medications and instructions.");
                }
                // If needs assistance for meds, require administer description
                if (req.body.medications === true && req.body.medications_self_administer === false && !req.body.medications_administer_description) {
                    throw new Error("Youth Medical & Permission: Please describe who should administer medications and how.");
                }

                // Health condition requirements if yes
                if (req.body.health_conditions === true && !req.body.health_conditions_description) {
                    throw new Error("Youth Medical & Permission: Please describe health conditions.");
                }

                // Surgery requirements if yes
                if (req.body.surgery_recent === true && !req.body.surgery_description) {
                    throw new Error("Youth Medical & Permission: Please describe the surgery/procedure.");
                }
                // require parent + permission + youth medical toggles exist
                if (!req.body.parent_guardian_name) throw new Error("Youth Medical & Permission: Parent/guardian name is required.");
                if (!req.body.parent_guardian_relationship) throw new Error("Youth Medical & Permission: Parent/guardian relationship is required.");
                if (req.body.permission_granted !== true) throw new Error("Youth Medical & Permission: Parent/guardian permission is required.");
                if (req.body.permission_granted_privilege !== true) throw new Error("Youth Medical & Permission: Parent/guardian acknowledgement of participant conduct is required.");
                if (!req.body.permission_date) throw new Error("Youth Medical & Permission: Permission date is required.");
                if (req.body.youth_acknowledgement_privilege !== true) throw new Error("Youth Medical & Permission: Youth participant acknowledgement of conduct is required.");
                if (!req.body.youth_acknowledgement) throw new Error("Youth Medical & Permission: Youth participant understanding of terms is required.");
            }

            if (type === "leader") {
                if (!req.body.role) throw new Error("Leader Role & Lodging: Leader role is required.");
                if (!req.body.arrival_date) throw new Error("Leader Role & Lodging: Arrival date is required.");
                if (!req.body.departure_date) throw new Error("Leader Role & Lodging: Departure date is required.");
                if (!req.body.medical_background) throw new Error("Leader Role & Lodging: Medical background is required.");

                // medical_background_description requirements if yes
                if (req.body.medical_background === true && !req.body.medical_background_description) {
                    throw new Error("Leader Role & Lodging: Please describe your medical or first-aid background.");
                }

                if (!req.body.lodging_type) throw new Error("Leader Role & Lodging: Lodging preference is required.");
            }

            // Terms/media minimums (shared)
            if (req.body.media_release_understood !== true) throw new Error("Terms & Media Consents: Media release acknowledgement is required.");
            if (req.body.terms_understood !== true) throw new Error("Final Confirmation: Terms acknowledgement is required.");

            return true;
        }),
        // --- Completed by ---
        body("form_completed_by")
            .trim()
            .notEmpty().withMessage("Final Confirmation: Form completed by name is required."),

    ];
};

registerValidation.checkRegistrationValidation = (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        const firstError = result.array({ onlyFirstError: true })[0];

        return res.status(400).render("register", {
            errorSummary: [firstError.msg], // ONE message only
            values: { ...req.body }         // keep values for later
        });
    }

    next();
};


// registerValidation.checkRegistrationValidation = (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const errorsArray = errors.array({ onlyFirstError: true });

//         // Map errors by field so you can show messages beside inputs
//         const errorsMapped = {};
//         errorsArray.forEach((e) => {
//             if (!errorsMapped[e.path]) errorsMapped[e.path] = e.msg;
//         });

//         // Keep their form values so they don't have to retype
//         const values = { ...req.body };

//         // For website forms, 400 is better than 500
//         return res.status(400).render("register", {
//             title: "Registration",
//             stake: res.locals.stake || req.app.locals.stake || "", // adjust if needed
//             errors,
//             errorSummary: errorsArray.map((e) => e.msg),
//             values,
//         });
//     }
//     next();
// };

module.exports = registerValidation;
