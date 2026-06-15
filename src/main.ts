import type PipeBomb from "@sdk";
import { DiscogsAttributeSource } from "./discogs.attribute-source.js";
import { DiscogsExternalUrlSource } from "./discogs.external-url-source.js";
import Discogs from "disconnect";
import { SoundCloudArtistPermalinkArtistIdentifier } from "./identifier/soundcloud-artist-permalink.artist-identifier.js";
import { DiscogsCache } from "./discogs-cache.js";
import path from "path";
import { SpotifyArtistIdArtistIdentifier } from "./identifier/spotify-artist-id.artist-identifier.js";
import { YoutubeHandleArtistIdentifier } from "./identifier/youtube-handle.artist-identifier.js";
import { YoutubeChannelIdArtistIdentifier } from "./identifier/youtube-channel-id.artist-identifier copy.js";

export default class Plugin implements PipeBomb.Plugin {
	private api!: PipeBomb.PluginApiContext;
	private logger!: PipeBomb.Logger;

	enable(apiContext: PipeBomb.PluginApiContext) {
		this.api = apiContext;
		this.logger = apiContext.getLogger();

		this.api.registerLanguageDirectory("language");
		this.api.registerIconDirectory("icons");

		this.api.requestCacheDirectory().then((cacheDir) => {
			const client = new Discogs.Client();
			const cache = new DiscogsCache(path.join(cacheDir, "cache.db"), client);

			this.api.registerArtistIdentifier(
				new SoundCloudArtistPermalinkArtistIdentifier(cache),
			);
			this.api.registerArtistIdentifier(
				new SpotifyArtistIdArtistIdentifier(cache),
			);
			this.api.registerArtistIdentifier(
				new YoutubeHandleArtistIdentifier(cache),
			);
			this.api.registerArtistIdentifier(
				new YoutubeChannelIdArtistIdentifier(cache),
			);

			this.api.registerAttributeSource(new DiscogsAttributeSource(cache));

			this.api.registerExternalUrlSource(new DiscogsExternalUrlSource());
		});
	}

	disable() {}

	public getLogger() {
		return this.logger;
	}

	public getApi() {
		return this.api;
	}
}
