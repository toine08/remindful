module.exports = function (api) {
	api.cache(true);
	const presets = ["babel-preset-expo"];

	return {
		presets,
		plugins: [
			[
				"module-resolver",
				{
					alias: {
						"@": ".",
					},
				},
				"first-instance",
			],

			"react-native-reanimated/plugin",

			[
				"module-resolver",
				{
					extensions: [".ts", ".tsx"],
				},
				"ts-extensions",
			],
		],
	};
};
