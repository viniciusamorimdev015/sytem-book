import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class IsAdmGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        
        const request = context.switchToHttp().getRequest()
        const role = request['user']?.role;

        if(role === 'admin'){
            return true
        } else {
            return false
        }


        console.log('IsAdmGuard')
        return true; // pode assecar a rota
    }
}