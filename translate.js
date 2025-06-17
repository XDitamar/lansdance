function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en', // This should be the original language of your page content
    includedLanguages: 'iw,ar,ru', // This will show only Hebrew, Arabic, and Russian in the dropdown
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
}

// Your existing getCookie, isTranslationActive, and event listener code remains the same
function getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function isTranslationActive() {
  return document.documentElement.classList.contains('translated-ltr') ||
         document.documentElement.classList.contains('translated-rtl');
}

window.addEventListener('load', () => {
  const langCookie = getCookie('googtrans');

  if (langCookie && langCookie !== '/en/en' && !isTranslationActive()) {
    if (!sessionStorage.getItem('translated')) {
      sessionStorage.setItem('translated', 'true');
      location.reload();
    }
  } else {
    sessionStorage.removeItem('translated');
  }
});

