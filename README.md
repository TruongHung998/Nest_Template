AppModule
├── imports
│   ├── ConfigModule
│   │   ├── forRoot
│   │   └── forRootAsync
│   ├── CacheModule
│   │   └── registerAsync
│   ├── TypeOrmModule
│   │   └── forRootAsync
│   ├── UsersModule
│   ├── AuthModule
│   ├── RolesModule
│   ├── PermissionsModule
│   ├── SearchModule
│   ├── CaslModule
│   ├── UtilsModule
│   ├── FilesModule
│   └── MinioClientModule
├── controllers
│   └── AppController
└── providers
    ├── AppService
    ├── {
    │   provide: APP_GUARD,
    │   useClass: JwtAuthGuard
    └── {
        provide: APP_FILTER,
        useClass: GlobalExceptionFilter

Explanation:
AppModule: The root module of the application.
  imports: Other modules that are imported into the AppModule.
    ConfigModule: Handles configuration settings.
    CacheModule: Manages caching, configured with Redis.
    TypeOrmModule: Configures TypeORM for database interactions.
    UsersModule: Manages user-related functionality.
    AuthModule: Handles authentication.
    RolesModule: Manages roles.
    PermissionsModule: Manages permissions.
    SearchModule: Handles search functionality.
    CaslModule: Manages CASL (access control).
    UtilsModule: Provides utility functions.
    FilesModule: Manages file operations.
    MinioClientModule: Manages MinIO client operations.
  controllers: Controllers that handle incoming requests.
    AppController: The main controller for the application.
  providers: Services and other providers.
    AppService: The main service for the application.
    APP_GUARD: Global guard for authentication (using JwtAuthGuard).
    APP_FILTER: Global exception filter (using GlobalExceptionFilter).
This diagram provides a high-level overview of the structure of your NestJS application. Each module, controller, and provider is represented, showing how they are organized within the AppModule.