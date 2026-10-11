import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class CreatePersonDto {

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;


    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 5,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    readonly password: string;
}
