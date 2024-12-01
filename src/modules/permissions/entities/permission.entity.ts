import { Role } from 'src/modules/roles/entities/role.entity';
import { BaseEntity } from 'src/modules/shared/base/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Permission extends BaseEntity {
	@Column()
	action: string;

	@Column()
	subject: string;

	@Column({ nullable: true })
	inverted: boolean;

	@Column({ type: 'simple-json', nullable: true })
	conditions: object;

	@Column({ type: 'simple-array', nullable: true })
	fields: string[];

	@Column({ nullable: true })
	reason: string;

	@ManyToOne(() => Role, (role) => role.permissions)
	role: Role;
}
