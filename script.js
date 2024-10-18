const form = document.querySelector("#form");
const inputs = form.querySelectorAll("input, select");

const email = document.querySelector("#email");
const country = document.querySelector("#country");
const zipcode = document.querySelector("#zipcode");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirm-password");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

// country specific zipcode patterns
const patterns = {
   US: /^\d{5}(-\d{4})?$/, // US: 5 or 5+4 digits
   CA: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/, // Canada: A1A 1A1 format
   UK: /^[A-Za-z]{1,2}\d{1,2} ?\d[A-Za-z]{2}$/, // UK: Postcode (e.g., W1A 1AA)
};

form.addEventListener("submit", (e) => {
   e.preventDefault();

   // check validity of all form elements
   const isValid = form.checkValidity();

   if (isValid) {
      // If the form is valid, you can submit it here
      form.submit();
   } else {
      // If the form is invalid, show the validation messages
      form.reportValidity();

      inputs.forEach((input) => {
         if (input === zipcode) {
            validateZipcode();
         } else if (input === confirmPassword) {
            validateConfirmPassword();
         } else {
            validateInput(input);
         }
      });
   }
});

// Add input event listeners to clear custom validity as user types
inputs.forEach((input) => {
   input.addEventListener("input", () => {
      if (input === zipcode) {
         validateZipcode();
      } else if (input === confirmPassword) {
         validateConfirmPassword();
      } else {
         input.setCustomValidity("");
         input.classList.remove("invalid");

         if (input.checkValidity()) {
            input.classList.add("valid");
         } else {
            input.classList.remove("valid");
         }
      }
   });

   // Add change event listener to validate inputs
   input.addEventListener("change", () => {
      if (input === zipcode) {
         validateZipcode();
      } else if (input === confirmPassword) {
         validateConfirmPassword();
      } else if (input === email) {
         validateEmail();
      } else if (input === password) {
         validatePassword();
      }
   });
});

// function to validate email
function validateEmail() {
   if (email.value === "") {
      email.setCustomValidity("Email is required");
   } else if (!emailRegex.test(email.value)) {
      email.setCustomValidity("Please enter a valid email address");
   } else {
      email.setCustomValidity("");
   }
   updateInputClasses(email);
}

// function to validate zipcode
function validateZipcode() {
   const pattern = patterns[country.value];
   if (pattern && pattern.test(zipcode.value.trim())) {
      zipcode.setCustomValidity("");
   } else {
      zipcode.setCustomValidity(
         "Please enter a valid zipcode for the selected country"
      );
   }
   updateInputClasses(zipcode);
}

// function to validate password
function validatePassword() {
   if (password.value === "") {
      password.setCustomValidity("Password is required");
   } else if (password.value.toLowerCase() === "password") {
      password.setCustomValidity("Password cannot be password");
   } else if (!passwordRegex.test(password.value)) {
      password.setCustomValidity(
         "Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character."
      );
   } else {
      password.setCustomValidity("");
   }
   updateInputClasses(password);
}

// function to validate confirm password
function validateConfirmPassword() {
   let errorMessage = "";

   if (confirmPassword.value === "") {
      errorMessage = "Confirm password is required";
   } else if (confirmPassword.value.toLowerCase() === "password") {
      errorMessage = "Confirm password cannot be password";
   } else if (confirmPassword.value !== password.value) {
      errorMessage = "Passwords do not match";
   }

   confirmPassword.setCustomValidity(errorMessage);
   updateInputClasses(confirmPassword);
}

// function to toggle the input classes
function updateInputClasses(input) {
   if (input.validity.valid) {
      input.classList.remove("invalid");
      input.classList.add("valid");
   } else {
      input.classList.add("invalid");
      input.classList.remove("valid");
   }
}

// function to handle general input validation
function validateInput(input) {
   if (input === email) {
      validateEmail(input);
   } else if (input === password) {
      validatePassword(input);
   } else {
      if (!input.checkValidity()) {
         input.classList.add("invalid");
         input.classList.remove("valid");
      } else {
         input.classList.remove("invalid");
         input.classList.add("valid");
         input.setCustomValidity("");
      }
   }
}
