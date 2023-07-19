enum ClassType {
	Special = 'Special',
}

enum Fakeability {
	Impossible = 'Impossible',
}

enum Importance {
	Unfathombable = 'Unfathombable',
}

enum WinCondition {
	Opsec = 'Hack the target node, or eliminate all opposing factions.',
}

type Role = {
	name: string;
	classType: ClassType;
	fakability: Fakeability;
	importance: Importance;
	winCondition: WinCondition;
	balancer: string[];
	creator: string[];
	isUnique?: boolean;
	iconURL?: string;
	flavourText?: string;
	abbreviation?: string;
};
