import { IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreateNotificationDto {

    @IsPositive()
    @Min(1)
    userId: number;

    @IsString()
    @MinLength(1)
    message: string;
}
