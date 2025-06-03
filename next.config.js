/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "oaidalleapiprodscus.blob.core.windows.net",
				port: "",
				pathname: "/**",
			},
		],
	},
	serverExternalPackages: ["potrace", "sharp"],
	webpack: (config, { isServer }) => {
		if (isServer) {
			// Don't bundle potrace on the server
			config.externals = [...(config.externals || []), "potrace"];
		}
		return config;
	},
};

module.exports = nextConfig;
