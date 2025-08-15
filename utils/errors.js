export class InvalidData extends Error {
    constructor(message, field) {
        super(message);
        this.name = "InvalidData";
        this.status= 400; // Bad Request
        this.field = field;
        this.response = {[field]: message};
    }
}

export class Forbidden extends Error {
    constructor(message = "you do not have permission to access this resource") {
        super(message);
        this.name = "Forbidden";
        this.status = 403; // Forbidden
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
    constructor(message) {
        super(message);
        this.name = "Unauthorized"; 
        this.status = 401; // Unauthorized
       
    }
}