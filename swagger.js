require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();

const renderExternalUrl = process.env.RENDER_EXTERNAL_URL;
const host = renderExternalUrl
  ? process.env.RENDER_EXTERNAL_URL.replace(/^https?:\/\//, '')
  : 'localhost:8080';
const schemes = renderExternalUrl ? ['https'] : ['http'];

const doc = {
  info: {
    title: 'Library API',
    description: 'REST API for managing library books and members',
    version: '1.0.0'
  },
  host,
  schemes,
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Auth',
      description: 'GitHub OAuth authentication endpoints'
    },
    {
      name: 'Books',
      description: 'Book management endpoints'
    },
    {
      name: 'Members',
      description: 'Library member management endpoints'
    }
  ],
  definitions: {
    Book: {
      _id: '674a1b2c3d4e5f67890abcde',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0-7432-7356-5',
      genre: 'Fiction',
      publishedYear: 1925,
      publisher: 'Scribner',
      description: 'A novel about the American dream set in the Jazz Age.',
      pageCount: 180,
      language: 'English',
      available: true
    },
    BookInput: {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0-7432-7356-5',
      genre: 'Fiction',
      publishedYear: 1925,
      publisher: 'Scribner',
      description: 'A novel about the American dream set in the Jazz Age.',
      pageCount: 180,
      language: 'English',
      available: true
    },
    Member: {
      _id: '674a1b2c3d4e5f67890abcdf',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      phone: '555-867-5309',
      membershipType: 'premium',
      joinDate: '2024-01-15',
      address: '123 Main Street, Anytown, USA',
      active: true
    },
    MemberInput: {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      phone: '555-867-5309',
      membershipType: 'premium',
      joinDate: '2024-01-15',
      address: '123 Main Street, Anytown, USA',
      active: true
    },
    AuthStatus: {
      authenticated: true,
      user: {
        id: '67fabc1234def56789012345',
        githubId: '12345678',
        username: 'octocat',
        displayName: 'The Octocat',
        email: 'octocat@github.com',
        avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
        provider: 'github'
      },
      loginUrl: '/auth/login'
    },
    AuthUser: {
      id: '67fabc1234def56789012345',
      githubId: '12345678',
      username: 'octocat',
      displayName: 'The Octocat',
      email: 'octocat@github.com',
      avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
      provider: 'github'
    },
    SuccessResponse: {
      message: 'Operation completed successfully'
    },
    CreatedResponse: {
      message: 'Resource created successfully',
      id: '674a1b2c3d4e5f67890abcde'
    },
    ErrorResponse: {
      error: 'Error message here'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
  './server.js',
  './routes/index.js',
  './routes/auth.js',
  './routes/books.js',
  './routes/members.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);
