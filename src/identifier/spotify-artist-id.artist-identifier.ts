import { UrlArtistIdentifier } from "./url.artist-identifier.js";

export class SpotifyArtistIdArtistIdentifier extends UrlArtistIdentifier {
	readonly id = "spotify_artist_id";

	getIdentity(url: string): string | null {
		if (url.startsWith("https://open.spotify.com/artist/")) {
			return url.substring("https://open.spotify.com/artist/".length);
		}
		return null;
	}
}
