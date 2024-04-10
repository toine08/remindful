import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";

import { Button, FormLabel, FormMessage, Input } from "@/components/ui";
import { supabase } from "@/config/supabase";
import { useSupabase } from "@/hooks/useSupabase";
import tw from "@/lib/tailwind";

const FormSchema = z
	.object({
		username: z.string().min(3, "Please enter a valid username."),
		email: z.string().email("Please enter a valid email address."),
		password: z
			.string()
			.min(8, "Please enter at least 8 characters.")
			.max(64, "Please enter fewer than 64 characters.")
			.regex(
				/^(?=.*[a-z])/,
				"Your password must have at least one lowercase letter.",
			)
			.regex(
				/^(?=.*[A-Z])/,
				"Your password must have at least one uppercase letter.",
			)
			.regex(/^(?=.*[0-9])/, "Your password must have at least one number.")
			.regex(
				/^(?=.*[!@#$%^&*])/,
				"Your password must have at least one special character.",
			),
		confirmPassword: z.string().min(8, "Please enter at least 8 characters."),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Your passwords do not match.",
		path: ["confirmPassword"],
	});

export default function SignUp() {
	const { signUp } = useSupabase();
	const router = useRouter();

	const {
		control,
		handleSubmit,
		trigger,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		try {
			//check if username is already used
			const { data: usernameData, error: usernameError } = await supabase
				.from("profiles")
				.select("username")
				.eq("username", data.username);

			if (usernameError) {
				console.error(
					"Erreur lors de la vérification du nom d'utilisateur :",
					usernameError,
				);
				return;
			}

			if (usernameData && usernameData.length > 0) {
				Alert.alert("This username is already used");
				return;
			}

			//check if email is already used

			const { data: emailData, error: emailError } = await supabase
				.from("profiles")
				.select("email")
				.eq("email", data.email);

			if (emailError) {
				console.error(
					"Erreur lors de la vérification de l'e-mail :",
					emailError,
				);
				return;
			}

			if (emailData && emailData.length > 0) {
				Alert.alert("This mail is already used");
				return;
			}

			const { user, error } = await supabase.auth.signUp({
				email: data.email,
				password: data.password,
				options: {
					data: {
						username: data.username,
						email: data.email,
						first_name: " ",
						last_name: " ",
					},
				},
			});

			if (error) {
				console.log("Error signing up:", error.message);
				return;
			}

			if (user) {
				const { data: profile, error: insertError } = await supabase
					.from("profiles")
					.insert([
						{ user_id: user.id, username: data.username, email: data.email },
					]);

				if (insertError) {
					console.log("Error inserting into profiles:", insertError.message);
					return;
				}

				console.log("User and profile created:", user, profile);
				Alert.alert("A confirmation mail as been sent!");
			}
		} catch (error: Error | any) {
			console.log("Unexpected error:", error.message);
		}
	}

	return (
		<SafeAreaView
			style={tw`flex-1 items-center bg-foreground dark:bg-stone-950 p-5`}
		>
			<Text style={tw`h1 self-start mb-5 text-dark-foreground dark:text-foreground`}>Remindful</Text>
			<Text style={tw`h3 self-start mb-5 text-dark-foreground dark:text-foreground`}>SignUp</Text>
			<View style={tw`w-full gap-4`}>
				<Controller
					name="username"
					control={control}
					render={({ field }) => (
						<View style={tw`gap-1.5`}>
							<FormLabel errors={errors.username}>Username</FormLabel>
							<Input
								value={field.value}
								onChangeText={(value) => {
									field.onChange(value);
								}}
								placeholder="Username"
							/>
							{errors.username && (
								<FormMessage>{errors.username?.message}</FormMessage>
							)}
						</View>
					)}
				/>

				<Controller
					control={control}
					name="email"
					render={({ field: { onChange, value } }) => (
						<View style={tw`gap-1.5`}>
							<FormLabel errors={errors.email}>Email</FormLabel>
							<Input
								placeholder="Email"
								value={value}
								onChangeText={onChange}
								onBlur={() => {
									trigger("email");
								}}
								error={errors.email}
								autoCapitalize="none"
								autoComplete="email"
								autoCorrect={false}
								keyboardType="email-address"
							/>
							{errors.email && (
								<FormMessage>{errors.email?.message}</FormMessage>
							)}
						</View>
					)}
				/>
				<Controller
					control={control}
					name="password"
					render={({ field: { onChange, value } }) => (
						<View style={tw`gap-1.5`}>
							<FormLabel errors={errors.password}>Password</FormLabel>
							<Input
								placeholder="Password"
								value={value}
								onChangeText={onChange}
								onBlur={() => {
									trigger("password");
								}}
								error={errors.password}
								autoCapitalize="none"
								autoCorrect={false}
								secureTextEntry

							/>
							{errors.password && (
								<FormMessage>{errors.password?.message}</FormMessage>
							)}
						</View>
					)}
				/>
				<Controller
					control={control}
					name="confirmPassword"
					render={({ field: { onChange, value } }) => (
						<View style={tw`gap-1.5`}>
							<FormLabel errors={errors.confirmPassword}>
								Confirm Password
							</FormLabel>
							<Input
								placeholder="Confirm password"
								value={value}
								onChangeText={onChange}
								onBlur={() => {
									trigger("confirmPassword");
								}}
								error={errors.confirmPassword}
								autoCapitalize="none"
								autoCorrect={false}
								secureTextEntry
							/>
							{errors.confirmPassword && (
								<FormMessage>{errors.confirmPassword?.message}</FormMessage>
							)}
						</View>
					)}
				/>
			</View>
			<View style={tw`w-full gap-y-4 absolute bottom-[50px]`}>
				<Button
					label="Sign Up"
					onPress={handleSubmit(onSubmit)}
					isLoading={isSubmitting}
				/>
				<Text
					style={tw`muted text-center underline`}
					onPress={() => {
						router.back();
					}}
				>
					Already have an account?
				</Text>
			</View>
		</SafeAreaView>
	);
}
