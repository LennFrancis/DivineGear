// Rules used to check the registration and login forms.

function validateUsername(value) {
    return /^[A-Za-z0-9_]{6,20}$/.test(value);
}

function usernameTaken(value) {
    return getUsers().some((user) => user.username === value);
}

function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePassword(value) {
    return value.length >= 8 &&
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value) &&
        /[0-9]/.test(value);
}

function passwordsMatch(a, b) {
    return a === b;
}

// Return an error message when a field is not valid.
function getFieldError(input) {
    const value = input.value;

    if (value.trim() === "") {
        return "This field is required.";
    }

    if (input.form.id === "registerForm") {
        if (input.name === "username") {
            if (!validateUsername(value)) {
                return "Username must be 6-20 characters: letters, numbers and underscores only.";
            }

            if (usernameTaken(value)) {
                return "Username is already taken.";
            }
        }

        if (input.name === "email" && !validateEmail(value)) {
            return "Please enter a valid email.";
        }

        if (input.name === "password" && !validatePassword(value)) {
            return "Password needs 8+ characters, one uppercase, one lowercase and one number.";
        }

        if (
            input.name === "confirm" &&
            !passwordsMatch(input.form.password.value, value)
        ) {
            return "Passwords do not match.";
        }
    }

    return "";
}

// Show the field status and its validation message.
function showFieldError(input, message) {
    input.classList.toggle("is-invalid", message !== "");
    input.classList.toggle("is-valid", message === "");
    input.nextElementSibling.textContent = message;
}

// Check all inputs before allowing form submission.
function validateForm(form) {
    let allValid = true;

    form.querySelectorAll("input").forEach((input) => {
        const message = getFieldError(input);
        showFieldError(input, message);

        if (message !== "") {
            allValid = false;
        }
    });

    return allValid;
}

// Clear the form and remove its validation styles.
function resetForm(form) {
    form.reset();

    form.querySelectorAll("input").forEach((input) => {
        input.classList.remove("is-valid", "is-invalid");
    });
}