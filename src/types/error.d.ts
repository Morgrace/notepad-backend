export interface IAppError extends Error {
  statusCode: number;
  status: "fail" | "error";
  isOperational: boolean;
  errmsg?: string;
  code?: number;
  path?: string;
  value?: string;
  keyValue?: Record<string, string>;
  errors?: Record<
    string,
    {
      message: string;
      name: string;
      properties: {
        message: string;
        type: string;
        path: string;
      };
      kind: string;
      path: string;
      value: unknown;
    }
  >;
}
