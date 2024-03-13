import { Text, TextProps } from "react-native";

import tw from "@/lib/tailwind";

export interface ILabelProps extends React.ComponentProps<typeof Text> {
	children?: React.ReactNode;
	style?: TextProps["style"];
}

export const Label = ({ children, style }: ILabelProps) => {
	return (
		<Text
			style={[
				tw`text-sm text-dark-primary dark:text-primary font-medium leading-5`,
				style,
			]}
		>
			{children}
		</Text>
	);
};
