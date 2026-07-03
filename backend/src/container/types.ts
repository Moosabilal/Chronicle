const TYPES = {
  // Repositories
  IUserRepository:    Symbol.for('IUserRepository'),
  IBlogRepository:    Symbol.for('IBlogRepository'),
  ICommentRepository: Symbol.for('ICommentRepository'),

  // Services
  IAuthService:    Symbol.for('IAuthService'),
  IBlogService:    Symbol.for('IBlogService'),
  ICommentService: Symbol.for('ICommentService'),
  IUploadService:  Symbol.for('IUploadService'),

  // Controllers
  AuthController:    Symbol.for('AuthController'),
  BlogController:    Symbol.for('BlogController'),
  UploadController:  Symbol.for('UploadController'),
};

export default TYPES;
