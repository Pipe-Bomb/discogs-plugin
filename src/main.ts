import type PipeBomb from "@sdk";
import { DiscogsAttributeSource } from "./discogs.attribute-source.js";
import { DiscogsExternalUrlSource } from "./discogs.external-url-source.js";

export default class Plugin implements PipeBomb.Plugin {
	private api!: PipeBomb.PluginApiContext;
	private logger!: PipeBomb.Logger;

	enable(apiContext: PipeBomb.PluginApiContext) {
		this.api = apiContext;
		this.logger = apiContext.getLogger();

		this.api.registerLanguageDirectory("language");
		this.api.registerIconDirectory("icons");

		this.api.registerAttributeSource(new DiscogsAttributeSource());

		this.api.registerExternalUrlSource(new DiscogsExternalUrlSource());
	}

	disable() {}

	public getLogger() {
		return this.logger;
	}

	public getApi() {
		return this.api;
	}
}
