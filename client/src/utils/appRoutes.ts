const ClientRoutes = {
  HOME: '/home',
  AI: '/aiAsistant',
  PROFILE: '/profile',
  POST: '/createPost',
  LOGIN: '/login',
  COMMENTS: '/comments/:postId',
} as const;

export default ClientRoutes;
