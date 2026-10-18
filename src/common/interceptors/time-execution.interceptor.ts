import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

export class TimeExecutionInterceptimn implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>) {
        
        const startTime = Date.now()

        return next.handle().pipe(
            tap(() => {
                const finalTime = Date.now();
                const elapsedTime = finalTime - startTime

                console.log(
                    `TimeExecutionInterceptimn: Levou ${elapsedTime}ms para executar `
                )
            })
        )
    }
}