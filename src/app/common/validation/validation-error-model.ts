export interface ValidationErrorResponse {
    timestamp: Date;
    status: number;
    error: string;
    invalidFields: invalidField[]
}

export interface invalidField {
    field: string;
    error: string;
}