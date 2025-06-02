// This function is called by Google's translate script
function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        {
            pageLanguage: 'en', // Set the original language of your page (e.g., 'en' for English)
            includedLanguages: 'en,he,es,fr', // List the languages you want to offer (comma-separated ISO codes)
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE, // This is Google's default widget layout
            autoDisplay: false // IMPORTANT: Prevents Google's default widget from popping up automatically
        },
        'google_translate_element' // The ID of the div where Google's widget will be placed (and remain hidden)
    );
}

document.addEventListener('DOMContentLoaded', () => {
    const translateIcon = document.getElementById('translate-icon');
    const languageDropdown = document.getElementById('language-dropdown');
    const langLinks = languageDropdown.querySelectorAll('a');

    // Make sure both elements were found. If not, something is wrong with your HTML IDs.
    if (!translateIcon) {
        console.error("Error: 'translate-icon' not found in the DOM.");
        return; // Stop execution if essential element is missing
    }
    if (!languageDropdown) {
        console.error("Error: 'language-dropdown' not found in the DOM.");
        return; // Stop execution if essential element is missing
    }


    // 1. Toggle dropdown visibility when the translate icon is clicked
    translateIcon.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevents the click from immediately triggering the document click listener below
        languageDropdown.classList.toggle('show'); // Toggle the 'show' class to display/hide the dropdown
    });

    // 2. Close dropdown if a click occurs anywhere outside of it
    document.addEventListener('click', (event) => {
        // If the clicked element is not inside the dropdown AND not the translate icon itself, hide the dropdown
        if (!languageDropdown.contains(event.target) && !translateIcon.contains(event.target)) {
            languageDropdown.classList.remove('show');
        }
    });

    // 3. Handle language selection from the dropdown
    langLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Stop the link's default navigation behavior
            event.stopPropagation(); // Prevent the click from bubbling up and potentially closing the dropdown too soon

            const langCode = link.dataset.lang; // Get the language code from the 'data-lang' attribute of the clicked link

            // Set the Google Translate cookie to tell Google which language to translate to.
            // The format is: googtrans=/auto/<target_language_code>
            // '/auto' tells Google to automatically detect the source language of the page.
            // 'path=/' ensures the cookie applies to the entire website.
            // The 'domain' part handles how the cookie applies; adjust for production vs. localhost.
            const domain = window.location.hostname === 'localhost' ? '' : `;domain=.${window.location.hostname}`;
            document.cookie = `googtrans=/auto/${langCode};path=/${domain};`;

            // Reload the page to apply the translation.
            // Google Translate's script automatically reads the 'googtrans' cookie on page load
            // and translates the content accordingly.
            window.location.reload();

            languageDropdown.classList.remove('show'); // Hide the dropdown after a language is selected
        });
    });

    // 4. Dynamically load the Google Translate script
    // This script must be loaded AFTER the 'googleTranslateElementInit' function is defined in your JS.
    // It's the core script that powers the Google Translate service on your page.
    const googleScript = document.createElement('script');
    googleScript.type = 'text/javascript';
    googleScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(googleScript);
});