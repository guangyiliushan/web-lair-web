// TODO: OpenPanel client configuration
// Reads from PUBLIC_ env variables and generates frontend init config

export function getOpenPanelClientConfig(): {
	enabled: boolean;
	apiUrl: string;
	clientId: string;
} {
	return {
		enabled: false,
		apiUrl: '',
		clientId: ''
	};
}
