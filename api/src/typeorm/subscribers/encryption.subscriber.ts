import { EventSubscriber, EntitySubscriberInterface, InsertEvent, LoadEvent } from 'typeorm';
import { EncryptionUtil } from '../../utils/encryption.util';

@EventSubscriber()
export class EncryptionSubscriber implements EntitySubscriberInterface {
  beforeInsert(event: InsertEvent<any>) {
    // Şifrelenecek alanları kontrol et
    if (event.entity.hasOwnProperty('encryptedFields')) {
      const fields = event.entity.encryptedFields();
      fields.forEach(field => {
        if (event.entity[field]) {
          event.entity[field] = EncryptionUtil.encrypt(event.entity[field]);
        }
      });
    }
  }

  afterLoad(entity: any, event?: LoadEvent<any>) {
    // Şifrelenmiş alanları çöz
    if (entity.hasOwnProperty('encryptedFields')) {
      const fields = entity.encryptedFields();
      fields.forEach(field => {
        if (entity[field]) {
          entity[field] = EncryptionUtil.decrypt(entity[field]);
        }
      });
    }
  }
} 