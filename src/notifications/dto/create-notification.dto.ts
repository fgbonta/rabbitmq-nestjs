import { IsNumber, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreateNotificationDto {

    @IsNumber()
    @IsPositive()
    @Min(1)
    userId: number;

    @IsString()
    @MinLength(1)
    message: string;
}
