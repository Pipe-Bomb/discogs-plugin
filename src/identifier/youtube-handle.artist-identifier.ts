import { UrlArtistIdentifier } from "./url.artist-identifier.js";

export class YoutubeHandleArtistIdentifier extends UrlArtistIdentifier {
	readonly id = "youtube_handle";

	getIdentity(url: string): string | null {
		const prefixes = [
			"https://www.youtube.com/@",
			"https://www.youtube.com/user/",
			"https://music.youtube.com/@",
		];

		for (const prefix of prefixes) {
			if (url.startsWith(prefix)) {
				return url.substring(prefix.length);
			}
		}

		return null;
	}
}
