export type IStatus = "received" | "cancelled";

export interface Subscription {
	id: string;
	userId: string;
	examId: string;
	status: IStatus;
	subscribedAt: number;
	cancelledAt?: number;
}
