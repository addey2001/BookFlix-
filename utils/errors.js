export class InvalidData extends Error {
    constructor(message, field) {
        super(message);
        this.name = "InvalidData";
        this.status= 400; // Bad Request
        this.field = field;
        this.response = {[field]: message};
    }
}

export class NotFound extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFound";
        this.status = 404; // Not Found
    }
}

export class Unauthorized extends Error {
    constructor(message = 'unauthorized') {
        super(message);
        this.name = "Unauthorized";
        this.status = 401; // Unauthorized
       
    }
}