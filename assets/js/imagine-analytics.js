(() => {
  'use strict';
  const measurementId = 'G-W9ML9X276E';
  const storageKey = 'site-analytics-consent-v2';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const panel = document.getElementById('analytics-choice');
  const settings = document.getElementById('analytics-settings');
  const accept = document.getElementById('analytics-accept');
  const decline = document.getElementById('analytics-decline');
  let allowed = false;
  let loaded = false;
  let fromSettings = false;
  const denied = {analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'};

  function savedChoice() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey));
      return value && ['accepted', 'declined'].includes(value.choice) &&
        value.time <= Date.now() && Date.now() - value.time < lifetime ? value.choice : null;
    } catch { return null; }
  }

  function clearAnalyticsCookies() {
    const domains = ['', window.location.hostname, '.' + window.location.hostname, 'mahmoodkhan.net', '.mahmoodkhan.net'];
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (name !== '_ga' && !name.startsWith('_ga_')) continue;
      for (const domain of domains) {
        for (const path of ['/', '/imagine', '/imagine/']) {
          document.cookie = `${name}=; Max-Age=0; path=${path}${domain ? '; domain=' + domain : ''}; SameSite=Lax`;
        }
      }
    }
  }

  function startAnalytics() {
    allowed = true;
    window['ga-disable-' + measurementId] = false;
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', denied);
    window.gtag('consent', 'update', {...denied, analytics_storage: 'granted'});
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {allow_google_signals: false, allow_ad_personalization_signals: false});
    if (/^\/licensing\/?$/.test(location.pathname)) window.gtag('event', 'licensing_page_view', {send_to: measurementId});
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(script);
  }

  function stopAnalytics() {
    allowed = false;
    window['ga-disable-' + measurementId] = true;
    if (loaded) window.gtag('consent', 'update', denied);
    clearAnalyticsCookies();
    // Unload Google's runtime after withdrawal; the saved decline prevents reloading it.
    if (loaded) window.location.reload();
  }

  function choose(choice) {
    try { localStorage.setItem(storageKey, JSON.stringify({choice, time: Date.now()})); } catch { /* Apply this visit's choice even when storage is unavailable. */ }
    panel.hidden = true;
    if (choice === 'accepted') startAnalytics(); else stopAnalytics();
    if (fromSettings) settings.focus();
  }

  settings.hidden = false;
  settings.addEventListener('click', () => { fromSettings = true; panel.hidden = false; accept.focus(); });
  accept.addEventListener('click', () => choose('accepted'));
  decline.addEventListener('click', () => choose('declined'));
  const initial = savedChoice();
  if (initial === 'accepted') startAnalytics();
  else { stopAnalytics(); panel.hidden = initial === 'declined'; }
  window.addEventListener('storage', (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    const choice = savedChoice();
    if (choice === 'accepted') { startAnalytics(); panel.hidden = true; }
    else { stopAnalytics(); panel.hidden = choice === 'declined'; }
  });
  const eventNames = {
    production_budget: 'imagine_production_budget_click',
    partner_information: 'imagine_partner_information_click',
    lead_partner: 'imagine_lead_partner_click',
    chapter_partner: 'imagine_chapter_partner_click',
    founding_partner: 'imagine_founding_partner_click',
    supporting_partner: 'imagine_supporting_partner_click',
    in_kind_partner: 'imagine_in_kind_partner_click',
    private_patron: 'imagine_private_patron_click',
    final_contact: 'imagine_final_contact_click',
    contact_email: 'imagine_contact_email_click'
  };
  const params = new URLSearchParams(window.location.search);
  const attribution = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const value = params.get(key);
    if (value) attribution[key] = value.slice(0, 100);
  }

  const licensingEvents = new Set(['instrumental_request', 'licensing_enquiry_click']);
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[data-licensing-event]');
    if (!allowed || !link || typeof window.gtag !== 'function' || !licensingEvents.has(link.dataset.licensingEvent)) return;
    window.gtag('event', link.dataset.licensingEvent, {send_to: measurementId, ...(link.dataset.trackId ? {track_id: link.dataset.trackId} : {}), ...attribution});
  });
  window.addEventListener('licensing-track-play', event => {
    if (!allowed || typeof window.gtag !== 'function') return;
    const trackId = event.detail?.trackId;
    if (typeof trackId !== 'string' || !/^[a-z0-9-]{1,80}$/.test(trackId)) return;
    window.gtag('event', 'track_play', {send_to: measurementId, track_id: trackId, ...attribution});
  });

  // Observe clicks without delaying or cancelling the visitor's email action.
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[data-campaign-cta]');
    if (!allowed || !link || typeof window.gtag !== 'function') return;
    const cta = link.dataset.campaignCta;
    if (!Object.hasOwn(eventNames, cta)) return;
    window.gtag('event', eventNames[cta], {
      send_to: 'G-W9ML9X276E',
      cta_id: cta,
      ...attribution
    });
  });
})();
