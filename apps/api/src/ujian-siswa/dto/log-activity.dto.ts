import { IsString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export enum ActivityType {
    TAB_SWITCH = 'TAB_SWITCH',
    EXIT_FULLSCREEN = 'EXIT_FULLSCREEN',
    COPY_PASTE = 'COPY_PASTE',
    RIGHT_CLICK = 'RIGHT_CLICK',
}

export class LogActivityDto {
    @IsString()
    @IsNotEmpty()
    ujianSiswaId: string;

    @IsEnum(ActivityType)
    activityType: ActivityType;

    @IsOptional()
    metadata?: any;
}
