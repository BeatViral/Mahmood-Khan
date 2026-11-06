"""Run after editing content/episodes.json to refresh the static, shareable cards."""
from html import escape
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
data = json.loads((root / "content/episodes.json").read_text(encoding="utf-8"))
cards = []
for episode in data["episodes"]:
    listener = episode["listenerEdition"]
    station = episode["broadcasterEdition"]
    cards.append(f'''<article class="episode" id="{escape(episode["id"])}">
<div><h3>{escape(episode["displayHeading"])}</h3><p>{escape(episode["subtitle"])}</p></div>
<div class="episode-player"><button type="button" class="button episode-listen" hidden>{escape(listener["label"])}</button>
<audio controls preload="none" aria-label="{escape(episode["displayHeading"])}" src="{escape(listener["streamUrl"])}"></audio>
<p role="status" class="episode-status"></p></div>
<a class="episode-file" href="{escape(station["url"])}" target="_blank" rel="noopener noreferrer">{escape(station["label"])} ↗</a></article>''')

page = root / "radio-show/index.html"
before, rest = page.read_text(encoding="utf-8").split("<!-- EPISODES START -->")
_, after = rest.split("<!-- EPISODES END -->")
page.write_bytes(("\n".join([before + "<!-- EPISODES START -->", *cards, "<!-- EPISODES END -->" + after])).encode())
