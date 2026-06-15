import { PersistentCache } from "./persistent-cache.js";
import { Client } from "disconnect";

export class DiscogsCache {
	private readonly cache: PersistentCache;

	constructor(
		dbFile: string,
		private readonly client: Client,
	) {
		this.cache = new PersistentCache(dbFile);
	}

	getArtist(id: number | string) {
		if (typeof id == "string") {
			id = Number(id);
		}
		if (isNaN(id)) {
			throw new Error("ID was not a valid number");
		}
		if (!Number.isInteger(id)) {
			throw new Error("ID was not an integer");
		}
		if (id <= 0) {
			throw new Error("ID was <= 0");
		}

		return this.cache.getOrFind(`artist:${id}`, async () =>
			this.client.database().getArtist(id),
		);
	}
}
