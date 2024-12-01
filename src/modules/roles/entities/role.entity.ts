import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { BaseEntity } from 'src/modules/shared/base/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Role extends BaseEntity {
	@Column()
	name: string;

	@ManyToOne(() => Role, { nullable: true })
	inheritance: Role;

	@OneToMany(() => User, (user) => user.role)
	users: User[];

	@OneToMany(() => Permission, (perm) => perm.role)
	permissions: Permission[];
}
