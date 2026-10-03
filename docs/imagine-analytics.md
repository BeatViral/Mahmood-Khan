# Site-wide analytics and IMAGINE campaign events

GA4 measurement ID: `G-W9ML9X276E`. Installed on all 13 HTML pages, including the homepage, campaign, privacy and 404 pages. Each page includes the shared analytics script and analytics-consent stylesheet.

Analytics is opt-in. No Google tag is fetched or configured until acceptance (or a remembered acceptance). Accept and Decline have equal visual treatment. The footer’s Analytics choices button reopens the choice. The site-wide `site-analytics-consent-v2` localStorage preference is remembered for 180 days; the previous campaign-only choice is re-requested to cover the wider scope; unavailable storage falls back to the current visit. Advertising consent stays denied. Withdrawal disables GA, clears its first-party cookies and reloads to unload its runtime. Other open tabs respond to preference changes. Pre-consent clicks are discarded.

After acceptance, the Google tag config sends the page view. GA4 handles session source, medium,
campaign and referrer attribution; the page does not send a second manual page view.

Each contact route sends one distinct custom event:

| CTA | Event |
| --- | --- |
| Lead, from £50,000 | `imagine_lead_partner_click` |
| Manchester or London chapter | `imagine_chapter_partner_click` |
| Founding, £15,000 | `imagine_founding_partner_click` |
| Supporting, £5,000 | `imagine_supporting_partner_click` |
| Strategic / in-kind | `imagine_in_kind_partner_click` |
| Individual patron | `imagine_private_patron_click` |
| Closing partnership button | `imagine_final_contact_click` |
| Closing email address | `imagine_contact_email_click` |

These measure intent to contact, not emails sent or funds committed. Each event
includes `cta_id` and any of the five standard UTM values present on the landing
URL (limited to 100 characters each). Native email links work even if analytics
is blocked. No email body, email subject or visitor-entered details are added to
the custom events.

## Outreach links

Use consistent lowercase UTM values and keep personal names/email addresses out
of campaign tags. Examples:

- Outdoor QR: `https://mahmoodkhan.net/imagine/?utm_source=buildhollywood&utm_medium=outdoor&utm_campaign=imagine_uk&utm_content=manchester_poster`
- Sponsor email: `https://mahmoodkhan.net/imagine/?utm_source=partner_outreach&utm_medium=email&utm_campaign=imagine_uk&utm_content=founding_invitation`

GA4 Realtime shows incoming events; acquisition reports provide source/medium
and campaign reporting. Separate event names make each CTA visible without
requiring a custom dimension. Register event-scoped custom dimensions for
`cta_id` or the UTM parameters only if a custom exploration needs those fields.

Deployment checks establish that the tag and event code are public and that
clicks queue the intended events. Receipt in the GA4 property must be checked in
Realtime/DebugView with account access. Reporting and key-event settings are
managed in the GA4 account; they are not changed by this installation.
