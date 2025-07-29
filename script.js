// Navbar Mobile Toggle
const mobileMenu = document.getElementById('mobile-menu');

mobileMenu.addEventListener('click', () => {
    // Create or toggle side menu container
    let sideMenu = document.querySelector('.side-menu');
    if (!sideMenu) {
        sideMenu = document.createElement('div');
        sideMenu.classList.add('side-menu');
        sideMenu.innerHTML = `
            <div class="side-menu-overlay"></div>
            <div class="side-menu-content">
                <ul class="side-nav-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="screenshots.html">Screenshots</a></li>
                    <li><a href="requirements.html">Requirements</a></li>
                    <li><a href="reviews.html">Reviews</a></li>
                    <li><a href="contact.html">Contact</a></li>
                    <li><a href="store.html">Store</a></li>
                </ul>
                <button class="close-side-menu">Close</button>
            </div>
        `;
        document.body.appendChild(sideMenu);

        // Close side menu functionality
        const closeSideMenu = sideMenu.querySelector('.close-side-menu');
        const sideMenuOverlay = sideMenu.querySelector('.side-menu-overlay');

        closeSideMenu.addEventListener('click', () => {
            sideMenu.classList.remove('active');
        });

        sideMenuOverlay.addEventListener('click', () => {
            sideMenu.classList.remove('active');
        });
    }
    sideMenu.classList.toggle('active');
});

// Smooth Scroll Function
function scrollToSection(event, sectionId) {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.warn(`Section with ID "${sectionId}" not found.`);
    }
}

// Example of adding event listeners to navigation links
document.querySelectorAll('a[data-scroll]').forEach(link => {
    link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('data-scroll');
        scrollToSection(event, targetId);
    });
});

// Update price based on country selection
document.getElementById('country').addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    const currency = selectedOption.getAttribute('data-currency');
    const taxRate = parseFloat(selectedOption.getAttribute('data-tax'));
    const basePrice = 19.99;

    if (!currency || isNaN(taxRate)) {
        console.error('Currency or tax rate data attributes are missing or invalid.');
        return;
    }

    const totalPrice = basePrice * (1 + taxRate);
    const formattedPrice = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(totalPrice);

    document.getElementById('price').innerText = formattedPrice;
});

