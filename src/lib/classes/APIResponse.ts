class APIResponse {
    status: string;
    message: string;
    data: any | null;
    responseCode: number | null;
    responseDescription: string | null;

    constructor(status: string, message: string, data: any | null = null, responseCode: number | null = null, responseDescription: string | null = null) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.responseCode = responseCode;
        this.responseDescription = responseDescription;
    }

    static success(message: string, data: any | null = null, responseCode: number | null = null): APIResponse {
        return new APIResponse("success", message, data, responseCode);
    }

    static error(message: string, responseCode: number | null = null, data: any, responseDescription: string | null = null): APIResponse {
        return new APIResponse("error", message, data, responseCode, responseDescription);
    }

    toJSON(): any {
        return {
            status: this.status,
            message: this.message,
            data: this.data !== null ? this.data : undefined,
            responseDescription: this.responseDescription !== null ? this.responseDescription : undefined,
            responseCode: this.responseCode
        };
    }
}

export default APIResponse;
