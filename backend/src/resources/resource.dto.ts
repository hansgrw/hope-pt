import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUrl,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateResourceDto {
  @ApiProperty({ example: 'Community Food Bank' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Provides food assistance to families in need.' })
  @IsString()
  @MaxLength(2000)
  description: string;

  @ApiPropertyOptional({ example: 'https://example.org' })
  @IsOptional()
  @IsUrl({}, { message: 'url must be a valid URL' })
  url?: string;

  @ApiPropertyOptional({ example: '+351 21 000 0000' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ example: 'Rua Exemplo, 123, Lisboa' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string;

  @ApiPropertyOptional({ example: 'info@example.org' })
  @IsOptional()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email?: string;

  @ApiPropertyOptional({ example: 'Red Cross Portugal' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  organization?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @ApiPropertyOptional({ example: 'Mon-Fri 9:00-17:00' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  schedule?: string;

  @ApiPropertyOptional({ example: 'Portuguese, English, French' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  languages?: string;

  @ApiPropertyOptional({ example: 'Open to all immigrants' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  eligibility?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  categoryId: number;
}

// All fields optional for updates
export class UpdateResourceDto extends PartialType(CreateResourceDto) {}

export class ResourceQueryDto {
  @ApiPropertyOptional({ example: 'food' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'false' })
  @IsOptional()
  @IsString()
  urgent?: string;
}
