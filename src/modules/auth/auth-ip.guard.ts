import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Client } from '../../db/entities/client.entity';

@Injectable()
export class AuthIpGuard implements CanActivate {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;

    const client = await this.dataSource
      .getRepository(Client)
      .findOne({ where: { ip } });

    if (client) {
      return true;
    }

    throw new UnauthorizedException('Ip address not found');
  }
}
