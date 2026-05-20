import {
	AlbumAttributes,
	AlbumInformationHelper,
	ArtistInformationHelper,
	AttributeSource,
	AttributeSourceApiContext,
	AttributeValue,
	Logger,
	TrackAttributes,
	TrackAttributionHelper,
} from "@sdk";
import Discogs from "disconnect";
import Axios from "axios";
import path from "path";
import { USER_AGENT } from "./constants.js";

export class DiscogsAttributeSource implements AttributeSource {
	public readonly id = "discogs";
	private api!: AttributeSourceApiContext;
	private logger!: Logger;
	private client!: Discogs.Client;

	enable(context: AttributeSourceApiContext): void {
		this.api = context;
		this.logger = context.getLogger();

		this.client = new Discogs.Client();

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
	): Promise<TrackAttributes> {
		return {
			track: null,
			artists: null,
		};
	}

	async getArtistAttributeValues(
		helper: ArtistInformationHelper,
	): Promise<AttributeValue[]> {
		const identity = helper.getIdentity("discogs_artist_id");

		if (!identity) {
			return [];
		}

		const attributes: AttributeValue[] = [];

		const numberId = Number(identity.value);
		if (Number.isInteger(numberId) && numberId > 0) {
			const artist = await this.client.database().getArtist(numberId);

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

			// todo: use artist.urls
		}

		return attributes;
	}

	async getAlbumAttributeValues(
		helper: AlbumInformationHelper,
	): Promise<AlbumAttributes> {
		return {
			album: null,
			artists: null,
		};
	}
}
