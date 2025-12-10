import { Injectable } from '@nestjs/common';
import { documents, Document } from './documents.entity';

@Injectable()
export class DocumentsService {
  findAll(tenantId: string): Document[] {
    return documents.filter((d) => d.tenantId === tenantId);
  }

  findOne(id: number): Document | undefined {
    return documents.find((d) => d.id === id);
  }

  create(data: Partial<Document>, user: any): Document {
    const newDoc: Document = {
      id: documents.length + 1,
      title: data.title || 'Untitled',
      content: data.content || '',
      tenantId: user.tenantId,
      tenantName: 'Unknown',
      ownerId: user.id,
      isConfidential: data.isConfidential || false,
      createdAt: new Date(),
    };
    documents.push(newDoc);
    return newDoc;
  }

  delete(id: number): boolean {
    const index = documents.findIndex((d) => d.id === id);
    if (index !== -1) {
      documents.splice(index, 1);
      return true;
    }
    return false;
  }
}
