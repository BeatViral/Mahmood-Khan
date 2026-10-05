# Licensing catalogue updates

Edit `assets/data/licensing.json`, then run `node scripts/build-licensing.cjs`.

Each track has `id`, `title`, `version`, `credit`, `audioUrl`, `instrumentalAvailable`, and `rights`. Keep approved public metadata only in this file. The builder renders accessible static cards and embeds the same data for optional players.

Set `audioUrl` to an approved, directly streamable preview URL. Leave it `null` to show the card and enquiry link without a player. Do not put private Drive sharing links, private master delivery URLs or access tokens in this public data. A Drive preview/share page is not a direct audio URL. Full WAV masters are supplied privately after enquiry.

All songs have instrumental versions available on request, as confirmed by the rights holder. Current master choices: Here and Now and Now She's Brave use the newly mastered versions. One Line Down's preview recording remains to be selected before adding its audio URL.

The existing consent-gated GA4 handles `licensing_page_view`, `track_play`, `instrumental_request`, and `licensing_enquiry_click`. No analytics event is sent before acceptance. Players appear only when a URL exists, load no media until requested, and pause other tracks when played.
