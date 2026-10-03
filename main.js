const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");
const btnDarkMode = document.querySelector("#btnDarkMode");
const wholePage = document.querySelector("#html");
const navBar = document.querySelector("#navbar");
const hamburgerBtn = document.querySelector("#hamburgerBtn");
const backBtn = document.querySelector("#backBtn");
const submitBtn = document.querySelector("#submitBtn");
const author = document.getElementById("name");
const email = document.getElementById("email");
const message = document.getElementById("message");

// JS only determines which section is currently in the viewport
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Remove active state from all links
                links.forEach((link) => {
                    link.removeAttribute("aria-current");
                });

                // Find the link that points to the visible section
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);

                // Let Tailwind's aria variant handle the styling
                if (activeLink) {
                    activeLink.setAttribute("aria-current", "page");
                }
            }
        });
    },
    {
        // Detect the section around the middle of the viewport
        rootMargin: "-40% 0px -40% 0px",
    },
);

// Watch every section
sections.forEach((section) => {
    observer.observe(section);
});

let toggle = true;

btnDarkMode.addEventListener("click", () => {
    toggle = !toggle;

    if (!toggle) {
        wholePage.classList.add("dark"); // Turn ON dark mode

        btnDarkMode.innerHTML = `<i class="ri-sun-line md:text-xl"></i>`;
    } else {
        wholePage.classList.remove("dark"); // Turn OFF dark mode

        btnDarkMode.innerHTML = `<i class="ri-moon-line md:text-xl"></i>`;
    }
});

hamburgerBtn.addEventListener("click", () => {
    navBar.classList.remove("translate-x-full");
});

backBtn.addEventListener("click", () => {
    navBar.classList.add("translate-x-full");
});

// Close navbar when clicking outside
document.addEventListener("click", (event) => {
    if (hamburgerBtn.contains(event.target)) {
        return;
    }

    if (navBar.contains(event.target)) {
        return;
    }

    navBar.classList.add("translate-x-full");
});

// TOAST
const toast = new Notyf({
    duration: 3000,
    position: { x: "right", y: "top" },
    dismissible: true,
});

emailjs.init("5epvSAdUbJyikY9F1");

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Check if any required field is empty
    if (author.value.trim() === "" || email.value.trim() === "" || message.value.trim() === "") {
        toast.error("Please fill in all fields");
        return;
    }

    submitBtn.innerText = "Sending...";

    emailjs
        .send("service_kuy38dt", "template_qguw13a", {
            name: author.value,
            from_email: email.value,
            message: message.value,
        })
        .then(() => {
            toast.success("Email sent");
            submitBtn.innerHTML = `
                Send Message
                <i class="ri-send-ins-line text-md"></i>
            `;
            author.value = "";
            email.value = "";
            message.value = "";
        })
        .catch(() => {
            toast.error("Email not sent");
            submitBtn.innerHTML = `
                Send Message
                <i class="ri-send-ins-line text-md"></i>
            `;
        });
});
