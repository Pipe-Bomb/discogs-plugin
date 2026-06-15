import { UrlArtistIdentifier } from "./url.artist-identifier.js";

export class SoundCloudArtistPermalinkArtistIdentifier extends UrlArtistIdentifier {
	readonly id = "soundcloud_artist_permalink";

	getIdentity(url: string): string | null {
		if (url.startsWith("https://soundcloud.com/")) {
			return url.substring("https://soundcloud.com/".length);
		}
		return null;
	}
}
