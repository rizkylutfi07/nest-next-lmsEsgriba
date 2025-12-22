import { Body, Controller, Get, Post, UseGuards, Req, Put, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateProfile(@Req() req: any, @Body() updateData: { name: string; email: string }) {
    return this.authService.updateProfile(req.user.userId, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(
    @Req() req: any,
    @Body() passwordData: { oldPassword: string; newPassword: string }
  ) {
    return this.authService.changePassword(req.user.userId, passwordData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/reset-password')
  async adminResetPassword(
    @Req() req: any,
    @Body() resetData: { userId: string; newPassword: string }
  ) {
    // Only admins can reset passwords
    if (req.user.role !== 'ADMIN') {
      throw new UnauthorizedException('Hanya admin yang dapat mereset password');
    }
    return this.authService.adminResetPassword(resetData.userId, resetData.newPassword);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: any) {
    return user;
  }
}
