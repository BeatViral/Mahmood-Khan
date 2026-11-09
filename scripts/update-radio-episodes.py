"""Run after editing content/episodes.json to refresh the static, shareable cards."""
from html import escape
import json
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
data = json.loads((root / "content/episodes.json").read_text(encoding="utf-8"))
cards = []
for episode in data["episodes"]:
    listener = episode["listenerEdition"]
    station = episode["broadcasterEdition"]
    cards.append(f'''<article class="episode" id="{escape(episode["id"])}" data-share-url="/radio-show/share/{escape(episode["id"])}/">
<img class="episode-cover" src="{escape(episode.get("image") or data["poster"])}" alt="" width="256" height="256" loading="lazy">
<div><h3>{escape(episode["displayHeading"])}</h3><p>{escape(episode["subtitle"])}</p></div>
<div class="episode-player"><button type="button" class="button episode-listen" hidden>{escape(listener["label"])}</button>
<audio controls preload="none" aria-label="{escape(episode["displayHeading"])}" src="{escape(listener["streamUrl"])}"></audio>
<p role="status" class="episode-status"></p></div>
<div class="episode-links"><button class="episode-share" type="button" hidden>Share episode</button>
<a class="episode-file" href="{escape(station["url"])}" target="_blank" rel="noopener noreferrer">{escape(station["label"])} ↗</a>
<span class="episode-listens" title="Includes a manually set starting count of {episode.get('listenBaseline', 0)}"><span class="episode-listen-total">{episode.get('listenBaseline', 0)}</span> listens<span class="sr-only">, including a manually set starting count of {episode.get('listenBaseline', 0)}</span></span></div></article>''')

page = root / "radio-show/index.html"
before, rest = page.read_text(encoding="utf-8").split("<!-- EPISODES START -->")
_, after = rest.split("<!-- EPISODES END -->")
page.write_bytes(("\n".join([before + "<!-- EPISODES START -->", *cards, "<!-- EPISODES END -->" + after])).encode())

template = page.read_text(encoding="utf-8")
for episode, card in zip(data["episodes"], cards):
    url = f'https://mahmoodkhan.net/radio-show/share/{episode["id"]}/'
    title = escape(f'{episode["displayHeading"]} | WORLD POP with Mahmood Khan')
    description = escape(f'Listen to {episode["displayHeading"]}. {episode["subtitle"]} Hosted by Mahmood Khan.')
    shared_page = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", template)
    for attribute, name, value in [
        ("name", "description", description),
        ("property", "og:title", title),
        ("property", "og:description", description),
        ("property", "og:url", url),
    ]:
        shared_page = re.sub(
            f'<meta {attribute}="{name}" content="[^"]*">',
            f'<meta {attribute}="{name}" content="{value}">',
            shared_page,
        )
    shared_page = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{url}">', shared_page)
    image_url = "https://mahmoodkhan.net" + (episode.get("image") or data["poster"])
    shared_page = re.sub(r'<meta property="og:image" content="[^"]*">', f'<meta property="og:image" content="{escape(image_url)}">', shared_page)
    shared_page = shared_page.replace("</head>", f'<meta property="og:image:width" content="1254"><meta property="og:image:height" content="1254"><meta property="og:image:type" content="image/jpeg"><meta name="twitter:image" content="{escape(image_url)}"></head>')
    content = f'<main id="main"><section class="radio-section"><p class="eyebrow">WORLD POP · Hosted by Mahmood Khan</p><h1 class="episode-page-title">Listen to WORLD POP</h1>{card}<p class="radio-links"><a href="/radio-show/">Explore the radio show and all episodes →</a></p></section></main>'
    shared_page = re.sub(r'<main id="main">.*?</main>', lambda _: content, shared_page, flags=re.S)
    destination = root / "radio-show/share" / episode["id"] / "index.html"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(shared_page.encode("utf-8"))
