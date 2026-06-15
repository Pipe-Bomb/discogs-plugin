import { UrlArtistIdentifier } from "./url.artist-identifier.js";

export class YoutubeChannelIdArtistIdentifier extends UrlArtistIdentifier {
	readonly id = "youtube_channel_id";

	getIdentity(url: string): string | null {
		const prefixes = [
			"https://www.youtube.com/channel/",
			"https://music.youtube.com/channel/",
		];

		for (const prefix of prefixes) {
			if (url.startsWith(prefix)) {
				return url.substring(prefix.length);
			}
		}

		return null;
	}
}
