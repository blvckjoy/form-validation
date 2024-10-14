const form = document.querySelector("#form");
const inputs = form.querySelectorAll("input, select");

form.addEventListener("submit", (e) => {
   e.preventDefault();

   const email = document.querySelector("#email");
   const password = document.querySelector("#password");
   const confirmPassword = document.querySelector("#confirm-password");
   const country = document.querySelector("#country");
   const zipcode = document.querySelector("#zipcode");

   const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

   // country specific zipcode patterns
   const patterns = {
      US: /^\d{5}(-\d{4})?$/, // US: 5 or 5+4 digits
      CA: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/, // Canada: A1A 1A1 format
      UK: /^[A-Za-z]{1,2}\d{1,2} ?\d[A-Za-z]{2}$/, // UK: Postcode (e.g., W1A 1AA)
   };

   // custom validity checks
   email.setCustomValidity(
      email.value.includes("@") ? "" : "Please enter a valid email address"
   );

   password.setCustomValidity(
      password.value === "password"
         ? "Password cannot be password"
         : !passwordPattern.test(password.value)
         ? "Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character."
         : ""
   );

   confirmPassword.setCustomValidity(
      password.value !== confirmPassword.value ? "Passwords do not match" : ""
   );

   zipcode.setCustomValidity(
      patterns[country.value] &&
         patterns[country.value].test(zipcode.value.trim())
         ? ""
         : "Please enter a valid zipcode for the selected country"
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
         if (!input.validity.valid) {
            input.classList.add("invalid");
         } else {
            input.classList.remove("invalid");
         }
      });
   }
});

// Add input event listeners to clear custom validity as user types
inputs.forEach((input) => {
   input.addEventListener("input", () => {
      input.setCustomValidity("");
      input.classList.remove("invalid");

      if (input.checkValidity()) {
         input.classList.add("valid");
      } else {
         input.classList.remove("valid");
      }
   });

   input.addEventListener("blur", () => {
      if (!input.checkValidity()) {
         input.classList.add("invalid");
      }
   });
});

inputs.forEach((input) => {
   if (input.checkValidity()) {
      input.classList.add("valid");
   }
});
