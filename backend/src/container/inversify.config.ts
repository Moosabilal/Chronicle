import 'reflect-metadata';
import { Container } from 'inversify';
import TYPES from './types';

// Repositories
import { IUserRepository }    from '../interfaces/IUserRepository';
import { IBlogRepository }    from '../interfaces/IBlogRepository';
import { ICommentRepository } from '../interfaces/ICommentRepository';
import { UserRepository }    from '../repositories/UserRepository';
import { BlogRepository }    from '../repositories/BlogRepository';
import { CommentRepository } from '../repositories/CommentRepository';

// Service interfaces
import { IAuthService }    from '../interfaces/services/IAuthService';
import { IBlogService }    from '../interfaces/services/IBlogService';
import { ICommentService } from '../interfaces/services/ICommentService';
import { IUploadService }  from '../interfaces/services/IUploadService';

// Service implementations
import { AuthService }    from '../services/AuthService';
import { BlogService }    from '../services/BlogService';
import { CommentService } from '../services/CommentService';
import { UploadService }  from '../services/UploadService';

// Controllers
import { AuthController }   from '../controllers/AuthController';
import { BlogController }   from '../controllers/BlogController';
import { UploadController } from '../controllers/UploadController';

const container = new Container();

// ── Repositories ────────────────────────────────────────────────────────────
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
container.bind<IBlogRepository>(TYPES.IBlogRepository).to(BlogRepository).inSingletonScope();
container.bind<ICommentRepository>(TYPES.ICommentRepository).to(CommentRepository).inSingletonScope();

// ── Services ────────────────────────────────────────────────────────────────
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService).inSingletonScope();
container.bind<IBlogService>(TYPES.IBlogService).to(BlogService).inSingletonScope();
container.bind<ICommentService>(TYPES.ICommentService).to(CommentService).inSingletonScope();
container.bind<IUploadService>(TYPES.IUploadService).to(UploadService).inSingletonScope();

// ── Controllers ─────────────────────────────────────────────────────────────
container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind<BlogController>(TYPES.BlogController).to(BlogController).inSingletonScope();
container.bind<UploadController>(TYPES.UploadController).to(UploadController).inSingletonScope();

export { container };
