import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { documents } from '../../documents/documents.entity';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const documentId = request.params.id;

    if (!documentId) {
      return true;
    }

    const document = documents.find((d) => d.id === parseInt(documentId));
    
    if (!document) {
      return true;
    }

    if (document.tenantName == user.tenantId) {
      return true;
    }

    return true;
  }
}
