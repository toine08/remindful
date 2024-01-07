import {
	TouchableOpacity,
	Text,
	ActivityIndicator,
	StyleSheet,
	TextStyle,
} from "react-native";

import tw from "@/lib/tailwind";

export type ButtonVariantTypes =
	| "primary"
	| "secondary"
	| "destructive"
	| "outline"
	| "ghost"
	| "link"
	| "icon";

export interface IButtonProps
	extends React.ComponentProps<typeof TouchableOpacity> {
	children?: React.ReactNode;
	variant?: ButtonVariantTypes;
	size?: "default" | "sm" | "lg" | "icon";
	label?: string;
	isLoading?: boolean;
	textStyle?: TextStyle; // Ajoutez cette ligne
}

export const Button = ({
	children,
	variant = "primary",
	size = "default",
	label = "Button",
	isLoading = false,
	textStyle, // Ajoutez cette ligne
	...props
}: IButtonProps) => {
	return (
		<TouchableOpacity
			style={StyleSheet.flatten([
				tw`flex-row items-center justify-center`,
				variant === "primary" && tw`bg-primary dark:bg-dark-primary`,
				variant === "secondary" && tw`bg-secondary dark:bg-dark-secondary`,
				variant === "destructive" &&
					tw`bg-destructive dark:bg-dark-destructive`,
				variant === "outline" && tw`border border-input`,
				size === "default" && tw`h-10 px-4 py-2`,
				size === "sm" && tw`h-9 px-3 rounded-md`,
				size === "lg" && tw`h-11 px-8 rounded-md`,
				props.style,
			])}
			{...props}
		>
			<Text style={textStyle}>{label}</Text>
		</TouchableOpacity>
	);
};
