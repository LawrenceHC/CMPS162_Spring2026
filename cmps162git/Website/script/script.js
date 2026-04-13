const form = document.getElementById("myForm");
const fields = [
    { id: "firstName", name: "First Name" },
    { id: "lastName", name: "Last Name" },
    { id: "city", name: "City" },
    { id: "state", name: "State" },
    { id: "zip", name: "Zip Code" }
];

// This resets the background when typing
fields.forEach(field => {
    const element = document.getElementById(field.id);
    element.addEventListener("input", () => {
        element.classList.remove("error-field");
        document.getElementById("message").innerHTML = "";
    });
});

form.addEventListener("submit", function(e) {
    e.preventDefault();

    let missing = [];
    let message = document.getElementById("message");
    message.innerHTML = "";

    fields.forEach(field => {
        const element = document.getElementById(field.id);
        element.classList.remove("error-field");

        if (element.value.trim() === "") {
            missing.push(field.name);
            element.classList.add("error-field");
        }
    });

    // Zip validation (i googled how how to do this efficiently)
    const zip = document.getElementById("zip");
    if (zip.value && !/^\d{5}$/.test(zip.value)) {
        missing.push("Valid Zip Code (5 digits)");
        zip.classList.add("error-field");
    }

    if (missing.length > 0) {
        message.className = "error";
        message.innerHTML = "Missing or invalid fields: " + missing.join(", ");
    } else {
        message.className = "success";
        message.innerHTML = "Form submitted successfully!";
    }
});
