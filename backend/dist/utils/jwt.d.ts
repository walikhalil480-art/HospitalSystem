import jwt from "jsonwebtoken";
export declare const signAccessToken: (payload: object) => string;
export declare const signRefreshToken: (payload: object) => string;
export declare const verifyToken: (token: string, secret?: string) => jwt.JwtPayload | null;
export declare const signToken: (payload: object) => string;
//# sourceMappingURL=jwt.d.ts.map