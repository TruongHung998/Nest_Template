export default () => ({
	port: parseInt(process.env.PORT, 10) || 3000,
	NODE_ENV: process.env.NODE_ENV,
	database: {
		host: process.env.TYPEORM_MYSQL_HOST,
		port: parseInt(process.env.TYPEORM_MYSQL_PORT, 10) || 3306,
		user: process.env.TYPEORM_MYSQL_USERNAME,
		password: process.env.TYPEORM_MYSQL_PASSWORD,
		db: process.env.TYPEORM_MYSQL_DB,
	},
	jwt: {
		secretKey: process.env.JWT_SECRET,
		EXP: process.env.JWT_EXP,
	},
	redis: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
		password: process.env.REDIS_PASS,
		common_db: process.env.REDIS_COMMON_DB,
		ttl: process.env.REDIS_TTL,
	},

	elasticSearch: {
		node: process.env.ELASTICSEARCH_NODE,
	},
});
