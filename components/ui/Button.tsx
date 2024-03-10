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
	| "icon"
	| "full"; // Add "full" variant here

export interface IButtonProps
	extends React.ComponentProps<typeof TouchableOpacity> {
	children?: React.ReactNode;
	variant?: ButtonVariantTypes;
	size?: "default" | "sm" | "lg" | "icon";
	label?: string;
	isLoading?: boolean;
	textStyle?: TextStyle;
}

export const Button = ({
	children,
	variant = "primary",
	size = "default",
	label = "Button",
	isLoading = false,
	textStyle,
	...props
}: IButtonProps) => {
	return (
		<TouchableOpacity
			style={StyleSheet.flatten([
				tw`items-center justify-center rounded-md`,
				variant === "primary" && tw`bg-primary dark:bg-dark-primary`,
				variant === "secondary" && tw`bg-secondary dark:bg-dark-secondary`,
				variant === "destructive" &&
					tw`bg-destructive dark:bg-dark-destructive`,
				variant === "outline" && tw`border border-input`,
				variant === "full" && tw`w-60 bg-secondary h-10 `,
				size === "default" && tw`h-10 px-4 py-2`,
				size === "sm" && tw`h-9 px-3 rounded-md`,
				size === "lg" && tw`h-11 px-8 rounded-md`,
				props.style,
			])}
			{...props}
		>
			<Text style={[textStyle, { textAlign: "center" }]}>{label}</Text>
		</TouchableOpacity>
	);
};
