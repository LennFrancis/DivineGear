// Save and read registered users in localStorage.
function getUsers() {
	return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
	localStorage.setItem("users", JSON.stringify(users));
}

// Read the account currently signed in.
function getCurrentUser() {
	return JSON.parse(localStorage.getItem("currentUser"));
}

// Add a new account to the saved users.
function registerUser(user) {
	const users = getUsers();
	users.push(user);
	saveUsers(users);
}

// Check the username and password against saved accounts.
function loginUser(username, password) {
	const user = getUsers().find((u) => u.username === username && u.password === password);
	if (user) localStorage.setItem("currentUser", JSON.stringify(user));
	return user;
}

// Remove the current account when the user logs out.
function logoutUser() {
	localStorage.removeItem("currentUser");
}

// Validate the form before creating an account.
function handleRegister(event) {
	event.preventDefault();
	const form = event.target;
	if (!validateForm(form)) return;
	registerUser({ username: form.username.value, email: form.email.value, password: form.password.value });
	resetForm(form);
	switchModal("registerModal", "loginModal");
	showToast("Account created! Please log in.");
}

// Check login details and update the page after success.
function handleLogin(event) {
	event.preventDefault();
	const form = event.target;
	if (!validateForm(form)) return;
	const user = loginUser(form.username.value, form.password.value);
	if (!user) {
		showFieldError(form.password, "Username or password is incorrect.");
		return;
	}
	resetForm(form);
	closeModal("loginModal");
	updateNavbar();
	showToast("Welcome, " + user.username + "!");
}

// Show Login or the signed-in user's name in the navbar.
function updateNavbar() {
	const area = document.getElementById("userArea");
	const user = getCurrentUser();
	if (user) {
		area.innerHTML = `<span class="fw-bold">Hi, ${user.username}</span><button class="btn btn-light" type="button" id="logoutBtn">Logout</button>`;
		document.getElementById("logoutBtn").addEventListener("click", () => {
			logoutUser();
			updateNavbar();
			showToast("You have been logged out.");
		});
	} else {
		area.innerHTML = '<button class="btn btn-light" type="button" id="loginBtn">Login</button>';
		document.getElementById("loginBtn").addEventListener("click", () => openModal("loginModal"));
	}
	updateCartCount();
}

// Connect the login and registration forms to their handlers.
function setupAuthForms() {
	["loginForm", "registerForm"].forEach((formId) => {
		const form = document.getElementById(formId);
		form.addEventListener("submit", formId === "loginForm" ? handleLogin : handleRegister);
		form.querySelectorAll("input").forEach((input) => {
			input.addEventListener("input", () => {
				showFieldError(input, getFieldError(input));
				if (input.name === "password" && form.confirm && form.confirm.value !== "") {
					showFieldError(form.confirm, getFieldError(form.confirm));
				}
			});
		});
		document.getElementById(formId.replace("Form", "Modal")).addEventListener("hidden.bs.modal", () => resetForm(form));
	});

	document.getElementById("goRegister").addEventListener("click", () => switchModal("loginModal", "registerModal"));
}

updateNavbar();
setupAuthForms();