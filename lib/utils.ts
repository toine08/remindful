import { supabase } from "@/config/supabase";

export async function handleFriendRequest(
	action: "accepted" | "rejected",
	friendRequestId: number,
) {
	const { error } = await supabase
		.from("friends")
		.update({ state: action })
		.eq("friend_request_id", friendRequestId);

	if (error) {
		console.log("Error updating friend request:", error.message);
	} else {
		alert(`Friend request ${action}!`);
	}
}

export async function getUsername(userId: string): Promise<string | null> {
	const { data: profiles, error } = await supabase
		.from("profiles")
		.select("username")
		.eq("id", userId)
		.single();

	if (error) {
		console.log("Error fetching username:", error.message);
		return null;
	}

	return profiles?.username || null;
}


export const updatePushToken = async (tokenValue: string | undefined, userId: string) => {
  try {
    // Récupérer l'enregistrement de l'utilisateur
    const { data: user, error: fetchError } = await supabase
      .from('profiles')
      .select('push_token')
      .eq('id', userId || '')
      .single();

    if (fetchError) {
      console.log('Erreur lors de la récupération du jeton push :', fetchError);
      return;
    }

    // Vérifier si push_token est déjà défini
    if (user?.push_token) {
      console.log('Le jeton push est déjà défini :', user.push_token);
      return;
    }

    // Mettre à jour push_token si non défini
    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({ push_token: tokenValue })
      .eq('id', userId || '');

    if (updateError) {
      console.log('Erreur lors de la mise à jour du jeton push :', updateError);
    } else {
      console.log('Jeton push mis à jour avec succès :', data);
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du jeton push :', error);
  }
};

