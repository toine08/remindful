import { useState } from "react";
import { TextInput, View } from "react-native";
import { useAppColorScheme } from "twrnc";

import tw from "@/lib/tailwind";

export interface IInputProps extends React.ComponentProps<typeof TextInput> {
	error?: string | any;
	isFocused?: boolean;
	size?: "small" | "medium" | "large";
}

export const Input = ({
	error,
	onBlur,
	size = "medium",
	...props
}: IInputProps) => {
	const [colorScheme] = useAppColorScheme(tw);
	const [isFocused, setIsFocused] = useState(false);

	const handleBlur = (event: any) => {
		setIsFocused(false);
		onBlur && onBlur(event);
	};

	const widthStyle =
		size === "small" ? tw`w-20` : size === "large" ? tw`w-60` : tw`w-40`;

	return (
		<View>
			<TextInput
				style={[
					tw`border rounded-lg border-stone-400 dark:border-neutral-500 flex-row mr-2 p-4 justify-between`,
					widthStyle,
					isFocused && tw` border-primary dark:border-dark-primary`,
					error && tw`border-destructive dark:border-dark-destructive`,
				]}
				placeholderTextColor={
					colorScheme === "dark"
						? tw.color("dark-muted-foreground")
						: tw.color("muted-foreground")
				}
				onFocus={() => setIsFocused(true)}
				onBlur={handleBlur}
				{...props}
			/>
		</View>
	);
};
