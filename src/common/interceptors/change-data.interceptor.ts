import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { count } from "console";
import { map, Observable } from "rxjs";

export class changeDataInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        
        return next.handle().pipe(
            map(data => {
                
                if(Array.isArray(data)) {
                    return {
                        data,
                        count: data.length
                    }
                }

                return data
            })
        )
    }
}