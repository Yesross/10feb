document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    const fullName = document.getElementById("fullName");
    const output = document.getElementById("output");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const address = document.getElementById("address");
    
    const namePattern = /^[A-Za-z\s]+$/;
    const emailPattern = /^[\w.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^\d{10}$/;

    function showError(input, message) {
        let errorMessage = input.nextElementSibling;
        if (!errorMessage || !errorMessage.classList.contains("error-message")) {
            errorMessage = document.createElement("span");
            errorMessage.classList.add("error-message");
            input.parentNode.insertBefore(errorMessage, input.nextSibling);
        }
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
        input.style.borderColor = "red";
    }

    
    function clearError(input) {
        let errorMessage = input.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains("error-message")) {
            errorMessage.textContent = "";
            errorMessage.style.display = "none";
        }
        input.style.borderColor = "#ddd";
    }

    function validateInput(input, pattern, message) {
        if (!pattern.test(input.value.trim())) {
            showError(input, message);
            return false;
        } else {
            clearError(input);
            return true;
        }
    }

    function updateOutput() {
        output.textContent = fullName.value;
    }

    fullName.addEventListener("input", function () {
        validateInput(fullName, namePattern, "Enter a valid full name");
        updateOutput();
    });

    email.addEventListener("input", function () {
        validateInput(email, emailPattern, "Enter a valid email.");
    });

    phone.addEventListener("input", function () {
        validateInput(phone, phonePattern, "Enter a valid 10-digit phone number.");
    });

    address.addEventListener("input", function () {
        if (address.value.trim() === "") {
            showError(address, "Address is required.");
        } else {
            clearError(address);
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        let isValid = true;

        if (!validateInput(fullName, namePattern, "Enter a valid full name")) isValid = false;
        if (!validateInput(email, emailPattern, "Enter a valid email.")) isValid = false;
        if (!validateInput(phone, phonePattern, "Enter a valid 10-digit phone number.")) isValid = false;
        if (address.value.trim() === "") {
            showError(address, "Address is required.");
            isValid = false;
        } else {
            clearError(address);
        }

        if (isValid) {
            alert('Form submitted successfully!');
            form.reset();
            output.textContent = "";
        }
    });
});
