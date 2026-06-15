import {
	ArtistIdentifier,
	ArtistInformationHelper,
	IdentifierDependency,
	Logger,
} from "@sdk";
import { DiscogsCache } from "../discogs-cache.js";

export abstract class UrlArtistIdentifier implements ArtistIdentifier {
	abstract readonly id: string;

	abstract getIdentity(url: string): string | null;

	constructor(private readonly cache: DiscogsCache) {}

	async identify(
		helper: ArtistInformationHelper,
		_logger: Logger,
	): Promise<string[] | null> {
		const artistId = helper.getIdentity("discogs_artist_id");
		if (!artistId) {
			return null;
		}

		const artist = await this.cache.getArtist(artistId.identity);

		const identities: string[] = [];

		if (artist.urls) {
			for (const url of artist.urls) {
				const identity = this.getIdentity(url);
				if (identity) {
					identities.push(identity);
				}
			}
		}

		return identities;
	}

	getDependencies(): IdentifierDependency[] {
		return [];
	}

	getSoftDependencies(): IdentifierDependency[] {
		return [
			{
				pluginId: null,
				sourceId: "discogs_artist_id",
			},
		];
	}
}
