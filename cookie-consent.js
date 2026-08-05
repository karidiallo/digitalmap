(function () {
  function loadAnalytics() {
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-NT6LZ4XV');
  }

  function loadMetaPixel() {
    // TODO: wklej tu kod Meta Pixel, gdy będzie gotowy.
  }

  function injectBanner() {
    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.id = 'cookieBanner';
    banner.innerHTML =
      '<div class="cookie-banner-text">' +
      '<p><b>Używamy plików cookies.</b> Niezbędne — do działania strony i formularza kontaktowego. ' +
      'Analityczne i marketingowe — tylko za Twoją zgodą, pomagają nam rozumieć ruch na stronie. ' +
      'Szczegóły w <a href="/polityka-prywatnosci/">polityce prywatności</a>.</p>' +
      '</div>' +
      '<div class="cookie-banner-actions">' +
      '<button class="cookie-btn-secondary" id="cookieReject">Tylko niezbędne</button>' +
      '<button class="cookie-btn-primary" id="cookieAccept">Akceptuję wszystkie</button>' +
      '</div>';
    document.body.appendChild(banner);
    return banner;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var consent = localStorage.getItem('dm_cookie_consent');

    if (consent === 'all') {
      loadAnalytics();
      loadMetaPixel();
      return;
    }

    var banner = injectBanner();
    if (!consent) banner.classList.add('show');

    document.getElementById('cookieAccept').addEventListener('click', function () {
      localStorage.setItem('dm_cookie_consent', 'all');
      banner.classList.remove('show');
      loadAnalytics();
      loadMetaPixel();
    });

    document.getElementById('cookieReject').addEventListener('click', function () {
      localStorage.setItem('dm_cookie_consent', 'essential');
      banner.classList.remove('show');
    });
  });
})();
