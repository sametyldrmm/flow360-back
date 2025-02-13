import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class IpTrackingGuard extends AuthGuard('ip-tracking') {} 