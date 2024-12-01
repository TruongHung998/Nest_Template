import {
	DataSource,
	EntitySubscriberInterface,
	EventSubscriber,
	InsertEvent,
	UpdateEvent,
} from 'typeorm';
import { User } from './entities/user.entity';
import { UserElasticIndex } from '../search/search-index/user.elastic.index';
import { Logger } from '@nestjs/common';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
	constructor(
		dataSource: DataSource,
		private readonly userEsIndex: UserElasticIndex,
		private logger: Logger,
	) {
		dataSource.subscribers.push(this);
	}

	listenTo() {
		return User;
	}

	// beforeInsert(event: InsertEvent<User>) {}

	async afterInsert(event: InsertEvent<User>): Promise<any> {
		this.logger.log(
			`${event.entity.username}-${event.entity.name}`,
			'After User Insert',
		);
		await this.userEsIndex.insertUserDocument(event.entity);
	}

	async afterUpdate(event: UpdateEvent<User>): Promise<any> {
		this.logger.log(
			`${event.entity.username}-${event.entity.name}`,
			'After User Update',
		);
		await this.userEsIndex.updateUserDocument(event.entity as User);
	}
}
