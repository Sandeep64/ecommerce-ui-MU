export class HttpErrorResponse {
    constructor(
      private status: number,
      private statusText: string,
      private message: string
    ) {}
  }
  
  