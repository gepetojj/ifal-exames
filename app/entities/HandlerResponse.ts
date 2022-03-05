export interface HandlerResponse<I> {
	isError: boolean;
	errorCode?: number;
	data?: I;
}
