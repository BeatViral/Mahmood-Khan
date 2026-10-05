# Licensing catalogue updates

The single source of truth is `assets/data/licensing.json`. It maps all 24 website-ready original previews and the seven supplied instrumental previews by their manifest filenames, under `assets/audio/licensing/`. Keep the public filenames as supplied and never add private WAV master paths.

The `featured` flag controls the first 11 cards; the remaining catalogue entries appear in the visible “Explore more music” grid. Every card lists that instrumentals are available on request unless an instrumental preview is included. Where both files exist, listeners can switch between Original and Instrumental. “Go On” currently has only the supplied Willoughby Symphony Orchestra instrumental preview, so its card offers that preview alone.

The custom player uses one shared audio element with `preload="none"`, loads a file only after Play is pressed, supports keyboard-operable buttons and seeking, and pauses the active recording when another is started. The original high-resolution WAV masters remain private.

The existing GA4 consent gate sends `licensing_page_view`, `licensing_enquiry`, `instrumental_request`, `licensing_track_play`, `licensing_track_pause`, and `licensing_track_share`. Track events include track ID, title and available UTM attribution; playback events also include Original/Instrumental mode. Analytics only runs after consent.

To rebuild static catalogue cards and embedded JSON after editing the config, run `node scripts/build-licensing.cjs`.

Each catalogue entry also has a static share landing page at `/licensing/share/{track-id}/`. These pages provide song-specific Open Graph and Twitter title/description metadata for social crawlers, and play the preview in an inline audio player on the same page. After changing catalogue entries, run `node scripts/build-licensing-share-pages.cjs` to regenerate all share pages. The Licensing page's Share song button uses the native device share sheet where available and copies the unique share link otherwise.
