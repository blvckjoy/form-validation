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

   // custom validity checks
   email.setCustomValidity(
      email.value === ""
         ? "Email is required"
         : !emailRegex.test(email.value)
         ? "Please enter a valid email address"
         : ""
   );

   password.setCustomValidity(
      password.value === ""
         ? "Password is required"
         : password.value === "password"
         ? "Password cannot be password"
         : !passwordRegex.test(password.value)
         ? "Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character."
         : ""
   );

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
         }
         if (input === confirmPassword) {
            validateConfirmPassword();
         } else {
            if (!input.validity.valid) {
               input.classList.add("invalid");
            } else {
               input.classList.remove("invalid");
            }
         }
      });
   }
});

function validateZipcode() {
   const pattern = patterns[country.value];
   if (pattern && pattern.test(zipcode.value.trim())) {
      zipcode.setCustomValidity("");
      zipcode.classList.add("valid");
      zipcode.classList.remove("invalid");
   } else {
      zipcode.setCustomValidity(
         "Please enter a valid zipcode for the selected country"
      );
      zipcode.classList.add("invalid");
      zipcode.classList.remove("valid");
   }
}

function validateConfirmPassword() {
   let errorMessage = "";

   if (confirmPassword.value === "") {
      errorMessage = "Password is required";
   } else if (confirmPassword.value === "password") {
      errorMessage = "Password cannot be password";
   } else if (confirmPassword.value !== password.value) {
      errorMessage = "Passwords do not match";
   }

   confirmPassword.setCustomValidity(errorMessage);
   confirmPassword.classList.toggle("valid", !errorMessage);
   confirmPassword.classList.toggle("invalid", !!errorMessage);
}

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

   input.addEventListener("blur", () => {
      if (input === zipcode) {
         validateZipcode();
      } else if (input === confirmPassword) {
         validateConfirmPassword();
      } else {
         if (!input.checkValidity()) {
            input.classList.add("invalid");
         }
      }
   });

   // validate the zipcode on country change
   if (input === zipcode) {
      input.addEventListener("change", validateZipcode);
   }
});

inputs.forEach((input) => {
   if (input.checkValidity()) {
      input.classList.add("valid");
   }
});
