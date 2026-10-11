import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

 export class CreateBookDto {

    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    readonly author: string;

    @IsString()
    @IsNotEmpty()
    readonly genre: string;

    @IsString()
    readonly rating: string;

    @IsString()
    readonly status: string;

    @IsInt()
    @IsPositive()
    readonly personId: number;
 }