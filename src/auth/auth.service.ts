import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { Repository } from "typeorm";
import { Person } from "src/person/entities/person.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingService } from "./hashing/hashing.service";
import jwtConfig from "./config/jwt.config";
import type { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(Person)
        private readonly personRepository: Repository<Person>,
        private readonly hashingService: HashingService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService,
    
    ) {}

    async login(logindto: LoginDto){
        
        const person = await this.personRepository.findOneBy({
            email: logindto.email
        })

        if(!person){
            throw new UnauthorizedException('E-mail não existente!')
        }

        const passwordIsValid = await this.hashingService.compare(logindto.password, person.passwordHash)

        if(!passwordIsValid){
            throw new UnauthorizedException('Senha incorreta!')
        }

        const accessToken = await this.jwtService.signAsync(
            {
                sub: person.id,
                email: person.email,
            },
            {
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn: this.jwtConfiguration.jwtTtl,
            }
        )

        return {
            accessToken
        }

    }
}