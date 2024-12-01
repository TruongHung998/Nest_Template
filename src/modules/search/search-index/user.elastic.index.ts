import { Injectable, OnModuleInit } from '@nestjs/common';
import { userIndex } from '../mapping/user.elastic';
import { User } from 'src/modules/users/entities/user.entity';
import { SearchService } from '../search.service';

@Injectable()
export class UserElasticIndex implements OnModuleInit {
	constructor(private readonly searchService: SearchService) {}

	async onModuleInit() {
		await this.searchService.createIndices(userIndex);
	}
	public async insertUserDocument(user: User): Promise<any> {
		// const data = this.userDocument(user);
		return await this.searchService.insertIndex(userIndex.index, user.id, user);
	}

	public async updateUserDocument(user: User): Promise<any> {
		return await this.searchService.updateIndex(userIndex.index, user.id, user);
	}

	public async searchUser(
		q: string,
		fields: Array<string>,
		fuzziness: number,
	): Promise<any> {
		const query = {
			multi_match: {
				query: q,
				fields,
				fuzziness,
			},
		};
		return await this.searchService.searchIndex(userIndex.index, query);
	}

	// private async deleteUserDocument(userId: string): Promise<any> {
	//   const data = {
	//     index: userIndex._index,
	//     type: userIndex._type,
	//     id: userId.toString(),
	//   };
	//   return await this.searchService.deleteDocument(data);
	// }

	// private bulkIndex(userId: string): any {
	//   return {
	//     _index: userIndex._index,
	//     _type: userIndex._type,
	//     _id: userId,
	//   };
	// }

	// private userDocument(user: User): any {
	//   const bulk = [];
	//   bulk.push({
	//     index: this.bulkIndex(user.id),
	//   });
	//   bulk.push(user);
	//   return {
	//     body: bulk,
	//     index: userIndex._index,
	//     type: userIndex._type,
	//   };
	// }
}
