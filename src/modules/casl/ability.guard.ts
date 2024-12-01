import * as Mustache from 'mustache';

import { Reflector } from '@nestjs/core';

import { map, size } from 'lodash';

import { RequiredRule, CHECK_ABILITY } from './abilities.decorator';

import {
	subject,
	RawRuleOf,
	MongoAbility,
	ForcedSubject,
	ForbiddenError,
	createMongoAbility,
} from '@casl/ability';

import {
	Injectable,
	CanActivate,
	ExecutionContext,
	NotFoundException,
	ForbiddenException,
	Inject,
} from '@nestjs/common';
import { connectionSource } from 'src/config/typeorm';
import { In } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Permission } from '../permissions/entities/permission.entity';
import { User } from '../users/entities/user.entity';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.contraints';

export const actions = [
	'read',
	'create',
	'update',
	'delete',
	'manage',
] as const;

export const subjects = ['Permission', 'Role', 'Story', 'User', 'all'] as const;

export type Abilities = [
	(typeof actions)[number],
	(
		| (typeof subjects)[number]
		| ForcedSubject<Exclude<(typeof subjects)[number], 'all'>>
	),
];

export type AppAbility = MongoAbility<Abilities>;

@Injectable()
export class AbilitiesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	createAbility = (rules: RawRuleOf<AppAbility>[]) =>
		createMongoAbility<AppAbility>(rules);

	getKeyPermissionRedis(roleId): string {
		return `permission:${roleId}`;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const rules: any =
			this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
			[];
		const currentUser = context.switchToHttp().getRequest().user;
		const request = context.switchToHttp().getRequest();
		let permissionCached: any = await this.cacheManager.get(
			this.getKeyPermissionRedis(currentUser.role.id),
		);

		// Cache permissions of the role
		if (!permissionCached) {
			/* The query is performing a recursive query to fetch all the roles and their inheritances
      starting from the role of the current user. */
			const rolesInheritances = await connectionSource.query(
				`with recursive cte (id, name, inheritanceId) as ( select id, name, inheritanceId from role where id = "${currentUser.role.id}" union all select r.id, r.name, r.inheritanceId from role r inner join cte on r.id = cte.inheritanceId ) select * from cte;`,
			);
			const roleIds = rolesInheritances.map((r) => r.id);

			const userPermissions = await connectionSource.manager
				.getRepository(Permission)
				.find({
					where: {
						role: {
							id: In(roleIds),
						},
					},
				});

			const parsedUserPermissions = this.parseCondition(
				userPermissions,
				currentUser,
			);

			//Cache permissions in 15mins
			await this.cacheManager.set(
				this.getKeyPermissionRedis(currentUser.role.id),
				parsedUserPermissions,
				900_000, //15mins
			);

			permissionCached = parsedUserPermissions;
		}

		try {
			const ability = this.createAbility(Object(permissionCached));
			for await (const rule of rules) {
				let sub = {};

				// Check conditions for each rule
				if (rule?.conditions) {
					//This section requires redesigning to allow for more dynamic conditions...
					const subId = request.params['id'];
					sub = await this.getSubjectById(subId, rule.subject);
				}

				// Check overall rule permission
				ForbiddenError.from(ability)
					.setMessage(JSON.stringify(ERRORS_DICTIONARY.PERM_NOT_ALLOWED))
					.throwUnlessCan(rule.action, subject(rule.subject, sub));

				// Check fields for each rule
				if (rule.fields) {
					Object.keys(request.body).forEach((k) => {
						ForbiddenError.from(ability)
							.setMessage(`You are not allowed to update field ${k}`)
							.throwUnlessCan(rule.action, subject(rule.subject, sub), k);
					});
				}
			}
			return true;
		} catch (error) {
			if (error instanceof ForbiddenError) {
				throw new ForbiddenException(error.message);
			}
			throw error;
		}
	}

	/**
	 * @example
	 * convert template field to actual value in conditions
	 * eg: conditions: { id: {{id}} } => conditions: { id:  "5d76a536-de0a-4152-8dc2-998a4720a177" }
	 */
	parseCondition(permissions: any, currentUser: User) {
		const data = map(permissions, (permission) => {
			if (size(permission.conditions)) {
				const preConds = {};
				Object.keys(permission.conditions).forEach((k) => {
					const parsedVal = Mustache.render(
						permission.conditions[k],
						currentUser,
					);
					preConds[k] = parsedVal;
				});

				return {
					...permission,
					conditions: preConds,
				};
			}
			return permission;
		});
		return data;
	}

	async getSubjectById(id: string, subName: string) {
		const subject = await connectionSource.query(
			`SELECT * from ${String(subName).toLowerCase()} WHERE id = '${id}'`,
		);
		if (!subject) throw new NotFoundException(`${subName} not found`);
		return subject;
	}
}
