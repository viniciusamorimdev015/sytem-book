import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { REQUEST_TOKEN_PAYLOAD_KEY } from "../auth.constantes";

export const TokenPayloadParam = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const context = ctx.switchToHttp();
        const request: Request = context.getRequest();
        return request[REQUEST_TOKEN_PAYLOAD_KEY]
    }
)