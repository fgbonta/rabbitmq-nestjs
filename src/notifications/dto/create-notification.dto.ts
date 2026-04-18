import { IsString, MinLength } from "class-validator";

export class CreateNotificationDto {
    @IsString()
    @MinLength(1)
    message: string;
}
