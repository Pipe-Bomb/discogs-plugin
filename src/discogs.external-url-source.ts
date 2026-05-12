import {
	ArtistExternalUrlHelper,
	ExternalUrl,
	ExternalUrlSource,
	TrackExternalUrlHelper,
} from "@sdk";

export class DiscogsExternalUrlSource implements ExternalUrlSource {
	getArtistUrls(helper: ArtistExternalUrlHelper): ExternalUrl[] | null {
		const discogsId = helper.getIdentity("discogs_artist_id");
		if (discogsId) {
			return [
				{
					iconId: "discogs_logo",
					name: "Discogs",
					url: `https://discogs.com/artist/${discogsId.value}`,
				},
			];
		}

		return null;
	}

	getTrackUrls(helper: TrackExternalUrlHelper): ExternalUrl[] | null {
		return null;
	}
}
