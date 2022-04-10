export interface NavigationItem {
	to: string;
	label: string;
	needsAuth?: boolean;
	isRoleBased?: boolean;
	alt?: boolean;
}
