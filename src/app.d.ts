/// <reference types="@sveltejs/kit" />

declare namespace App {
	interface Session {
		id?: string
	}

	interface Stuff {
		system?: string
	}
}
