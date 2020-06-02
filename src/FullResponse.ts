import { Response } from 'express';

export class FullResponse {

  public statusCode = 200;
  public headers: Record<string, string> = {};

  constructor(public body?: any) {
  }

  json(data: any): this {
    this.header('Content-Type', 'application/json');
    this.body = JSON.stringify(data);
    return this;
  }

  header(key: string, value: string): this {
    this.headers[key.toLowerCase()] = value;
    return this;
  }
  status(code: number): this {
    this.statusCode = code;
    return this;
  }

  public writeToResponse(res: Response) {
    res.status(this.statusCode);
    for(const [key, value] of Object.entries(this.headers))
      res.setHeader(key, value);

    res.send(this.body);
  }
}
