# WORLD POP — Google Drive Episode Intake (free, not activated)

This is the first safe part of the intended episode-to-knowledge workflow. It watches the **existing** private Google Drive folder for episode MP3/audio and transcripts, and records each new file in a private episode intake spreadsheet.

**This is not installed or running yet.** It requires a one-time Apps Script authorisation in the Google account controlling the Drive folder. It also **does not transcribe audio, research external facts, generate articles, or publish pages**, as those functions need an approved transcription/research service and editorial controls. The static website remains fully separate from this Google account.

## Verified intake location

Folder: https://drive.google.com/drive/folders/1Ars8NSU0GfKBDWjTcFgvd1I-gH97IkUx

Episode 1 examples already there:
- `WORLD_POP_EP01_BROADCAST master.mp3`
- `World pop Show 1 website.mp3`

## One-time setup

1. Signed into the Google account with access to that folder, open https://script.google.com/ and create a new Apps Script project named **WORLD POP intake**.
2. Copy the complete source from `scripts/world-pop-drive-intake.gs` into `Code.gs`.
3. Run `setupWorldPopIntake` once and accept Google Drive, Sheets and script-trigger permissions.
4. The script creates a **private** spreadsheet named **WORLD POP — Episode Intake Queue** inside the original Drive folder. It scans hourly. No website or GitHub permissions are requested.
5. Test by uploading a file named `WORLD_POP_EP02_BROADCAST.mp3`, then manually run `scanWorldPopEpisodes` (or allow the hourly scheduled scan). Check the queue row and status. The script groups an associated `WORLD_POP_EP02_transcript.txt` under the same episode.

## What happens next

On every new upload the queue records the episode number, audio or transcript role, file name, Drive URL, modified date, availability of a transcript and review status. It avoids duplicate records using the Drive file ID. Multiple audio files for one episode are supported (broadcaster master and listener edition).

**Review gate:** a Drive audio upload is never treated as permission to publish a radio episode. Before going public, a human or approved editorial agent must verify: the episode is actually released, audio rights and link sharing, names and quotations, transcript accuracy and outside-source claims. A research draft from transcripts should first be proposed as a GitHub pull request, not merged without review.

To make the full audio-to-researched-article chain automatic, we need to choose and configure a transcription provider and AI research model with defined free limits or costs, plus a deployment identity with limited GitHub permissions. No API keys or passwords should be put in this repository or copied into a public page. The first-release library already uses committed static HTML and does not require GitHub Actions.
