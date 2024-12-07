// Function to validate registration form
function submitForm(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get input values
  const fullName = document.getElementById("sName").value.trim();
  const quizNumber = document.getElementById("sRoll").value.trim();
  const email = document.getElementById("sEmail").value.trim();
  const password = document.getElementById("sPass").value.trim();

  // Regular expressions for validation
  const emailRegex = /^(?:[a-zA-Z0-9._%+-]+)@(gmail|yahoo|rocketmail)\.com$/;
  const passwordRegex = /^[A-Z](?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;

  // Validation flags
  let isValid = true;
  let errorMessage = "";

  // Validate full name
  if (fullName.length < 10 || fullName.length > 21) {
    isValid = false;
    errorMessage += "Full Name must be between 10 and 21 characters.\n";
  }

  // Validate quiz number
  if (!/^[0-9]+$/.test(quizNumber)) {
    isValid = false;
    errorMessage += "Quiz Number must be a valid number.\n";
  }

  // Validate email
  if (!emailRegex.test(email)) {
    isValid = false;
    errorMessage +=
      "Email must be a valid Gmail, Yahoo, or Rocketmail address.\n";
  }

  // Validate password
  if (!passwordRegex.test(password)) {
    isValid = false;
    errorMessage +=
      "Password must start with a capital letter, include at least one digit, and one special character.\n";
  }

  // Check if the form is valid
  if (isValid) {
    // Prepare user data
    const userData = {
      fullName,
      quizNumber,
      email,
      password,
    };

    // Save data to local storage
    const existingData = JSON.parse(localStorage.getItem("quiz-app")) || [];
    existingData.push(userData);
    localStorage.setItem("quiz-app", JSON.stringify(existingData));

    // Success alert
    Swal.fire({
      icon: "success",
      title: "Registration Successful",
      text: "Your data has been saved successfully!",
      confirmButtonText: "Go to Login",
    }).then(() => {
      // Redirect to index.html
      window.location.href = "index.html";
    });

    // Reset the form
    document.getElementById("form").reset();
  } else {
    // Error alert
    Swal.fire({
      icon: "error",
      title: "Registration Failed",
      text: errorMessage,
    });
  }
}

// Attach the submitForm function to the form
const form = document.getElementById("form");
form.addEventListener("submit", submitForm);
