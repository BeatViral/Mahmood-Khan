(() => {
  'use strict';
  const eventNames = {
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

  // Observe clicks without delaying or cancelling the visitor's email action.
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[data-campaign-cta]');
    if (!link || typeof window.gtag !== 'function') return;
    const cta = link.dataset.campaignCta;
    if (!Object.hasOwn(eventNames, cta)) return;
    window.gtag('event', eventNames[cta], {
      send_to: 'G-W9ML9X276E',
      cta_id: cta,
      ...attribution
    });
  });
})();
