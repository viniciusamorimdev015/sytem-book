import { HashingService } from "./hashing.service";
import * as bcrypt from 'bcryptjs'

export class BcryptService extends HashingService {
    async hash(password: string): Promise<string>{
        const salt = await bcrypt.genSalt()
        return bcrypt.hash(password, salt) // gera uma hash
    }
    async compare(password: string, passwordHashing: string): Promise<boolean>{
        return bcrypt.compare(password, passwordHashing) // true == logado | false == senha errada
    }
}