<h1>
    <img src="https://raw.githubusercontent.com/Pipe-Bomb/.github/refs/heads/master/assets/logos/Pipe%20Bomb%20no%20background%20w%20outline.png" width="40" />
    Discogs Plugin
</h1>

Retrives artist attributes from [Discogs](https://www.discogs.com). This plugin doesn't implement any identities, and requires another plugin to assign the "`discogs_artist_id`" identity to artists before it will retrieve attributes for them. Initially designed to be used alongside the official [MusicBrainz plugin](https://github.com/pipe-bomb/musicbrainz-plugin), which correctly implements this identity.

## Installation

Clone the repo into your [Pipe Bomb server's](https://github.com/pipe-bomb/server) `plugins` directory. Then inside, run:

```bash
npm ci
npm run build
```

## Attributes

### Artist

| Attribute    | Type             | Multiple | Description                                                                                            |
| :----------- | ---------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `name`       | `string`         | ❌       | The name of the artist. On Discogs, this is often the artist's legal name instead of their stage name. |
| `thumb`      | `buffer` (image) | ❌       | The profile picture of the artist.                                                                     |
| `background` | `buffer` (image) | ✅       | The background image of the artist.                                                                    |
