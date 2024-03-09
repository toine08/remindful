interface PhoneNumber {
	id: string;
	number: string;
}

export interface Contact {
	id: string;
	name: string;
	phoneNumbers: PhoneNumber[];
}
interface FriendProps {
	name: string;
	age: number;
}
