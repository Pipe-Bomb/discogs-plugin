import {
	AlbumInformationHelper,
	AlbumMetadata,
	ArtistInformationHelper,
	ArtistMetadata,
	AttributeSource,
	AttributeSourceApiContext,
	AttributeValue,
	Logger,
	TrackAttributionHelper,
	TrackMetadata,
} from "@sdk";
import Axios from "axios";
import path from "path";
import { USER_AGENT } from "./constants.js";
import { DiscogsCache } from "./discogs-cache.js";

export class DiscogsAttributeSource implements AttributeSource {
	public readonly id = "discogs";
	private api!: AttributeSourceApiContext;
	private logger!: Logger;

	constructor(private readonly cache: DiscogsCache) {}

	enable(context: AttributeSourceApiContext): void {
		this.api = context;
		this.logger = context.getLogger();

		this.api.registerArtistAttributes([
			{
				key: "name",
				type: "string",
				supportsMultiple: false,
			},
			{
				key: "thumb",
				type: "buffer",
				supportsMultiple: false,
			},
			{
				key: "background",
				type: "buffer",
				supportsMultiple: false,
			},
		]);
	}

	getName(): string {
		return "Discogs";
	}

	async getTrackAttributeValues(
		_helper: TrackAttributionHelper,
	): Promise<TrackMetadata> {
		return {
			attributes: null,
			artists: null,
		};
	}

	async getArtistAttributeValues(
		helper: ArtistInformationHelper,
	): Promise<ArtistMetadata> {
		const identity = helper.getIdentity("discogs_artist_id");

		if (!identity) {
			return {
				attributes: null,
			};
		}

		const attributes: AttributeValue[] = [];

		const artist = await this.cache.getArtist(identity.identity);
		attributes.push({
			key: "name",
			value: artist.name.replace(/\s\(\d+\)$/, ""), // remove (2) suffix
		});

		const thumbnail = artist.images?.find((image) => image.type == "primary");
		if (thumbnail) {
			const { data } = await Axios.get<Buffer>(thumbnail.resource_url, {
				responseType: "arraybuffer",
				headers: {
					"User-Agent": USER_AGENT,
				},
			});

			attributes.push({
				key: "thumb",
				value: {
					buffer: data,
					extension: path.extname(thumbnail.resource_url).substring(1),
				},
			});
		}

		const background = artist.images?.find(
			(image) => image.type == "secondary",
		);
		if (background) {
			const { data } = await Axios.get<Buffer>(background.resource_url, {
				responseType: "arraybuffer",
				headers: {
					"User-Agent": USER_AGENT,
				},
			});

			attributes.push({
				key: "background",
				value: {
					buffer: data,
					extension: path.extname(background.resource_url).substring(1),
				},
			});
		}

		return { attributes };
	}

	async getAlbumAttributeValues(
		_helper: AlbumInformationHelper,
	): Promise<AlbumMetadata> {
		return {
			attributes: null,
			artists: null,
		};
	}
}
