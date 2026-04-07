import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { UserController } from './interfaces/controllers/UserController';
import { AuthController } from './interfaces/controllers/AuthController';
import { DepartmentController } from './interfaces/controllers/DepartmentController';
import { ElementTypeController } from './interfaces/controllers/ElementTypeController';
import { BrandController } from './interfaces/controllers/BrandController';
import { PersonController } from './interfaces/controllers/PersonController';
import { AssetController } from './interfaces/controllers/AssetController';
import { AssetSpecsController } from './interfaces/controllers/AssetSpecsController';
import { AssetAssignmentController } from './interfaces/controllers/AssetAssignmentController';
import { ReportController } from './interfaces/controllers/ReportController';
import { authenticate } from './middlewares/auth';

const app = express();
app.use(bodyParser.json());

// CORS: allow frontend origin (adjust or set CORS_ORIGIN env var)
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3001', credentials: true }));

// Swagger setup
const protocol = (process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH) ? 'https' : 'http';
const swaggerDefinition = {
	openapi: '3.0.0',
	info: { title: 'Inventario API', version: '1.0.0' },
	servers: [{ url: `${protocol}://localhost:${process.env.PORT || 3000}` }]
};

const swaggerOptions = {
	swaggerDefinition,
	apis: ['./src/interfaces/controllers/*.ts', './src/**/*.ts']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const userController = new UserController();
const authController = new AuthController();
const departmentController = new DepartmentController();
const elementTypeController = new ElementTypeController();
const brandController = new BrandController();
const personController = new PersonController();
const assetController = new AssetController();
const assetSpecsController = new AssetSpecsController();
const assetAssignmentController = new AssetAssignmentController();
const reportController = new ReportController();

// Person routes
app.get('/persons', (req, res) => personController.getAll(req, res));
app.get('/persons/:id', (req, res) => personController.getById(req, res));
app.post('/persons', (req, res) => personController.create(req, res));
app.put('/persons/:id', (req, res) => personController.update(req, res));
app.patch('/persons/:id/active', (req, res) => personController.setActive(req, res));

// Asset routes
app.get('/assets', (req, res) => assetController.getAll(req, res));
app.get('/assets/:id', (req, res) => assetController.getById(req, res));
app.post('/assets', (req, res) => assetController.create(req, res));
app.put('/assets/:id', (req, res) => assetController.update(req, res));
app.patch('/assets/:id/active', (req, res) => assetController.setActive(req, res));
app.patch('/assets/:id/status', (req, res) => assetController.setStatus(req, res));

// Asset specs (only for certain assets like laptops)
app.post('/assets/:id/specs', (req, res) => assetSpecsController.create(req, res));
app.put('/assets/:id/specs', (req, res) => assetSpecsController.update(req, res));

// Asset assignments
app.get('/assignments', (req, res) => assetAssignmentController.getAll(req, res));
app.get('/assignments/:id', (req, res) => assetAssignmentController.getById(req, res));
app.post('/assignments', (req, res) => assetAssignmentController.create(req, res));
app.put('/assignments/:id', (req, res) => assetAssignmentController.update(req, res));
app.patch('/assignments/:id/return', (req, res) => assetAssignmentController.markReturn(req, res));

// Reports
app.get('/reports/inventory', (req, res) => reportController.getInventory(req, res));

app.get('/users/:id', (req, res) => userController.getById(req, res));
app.post('/auth/login', (req, res) => authController.login(req, res));

// ejemplo de ruta protegida
app.get('/profile', authenticate, (req, res) => {
	const user = (req as any).user;
	res.json({ user });
});

app.get('/', (req, res) => res.json({ ok: true }));

// Catalog routes
app.get('/departments', (req, res) => departmentController.getAll(req, res));
app.get('/departments/:id', (req, res) => departmentController.getById(req, res));
app.post('/departments', (req, res) => departmentController.create(req, res));
app.put('/departments/:id', (req, res) => departmentController.update(req, res));
app.patch('/departments/:id/active', (req, res) => departmentController.setActive(req, res));

app.get('/elementtypes', (req, res) => elementTypeController.getAll(req, res));
app.get('/elementtypes/:id', (req, res) => elementTypeController.getById(req, res));
app.post('/elementtypes', (req, res) => elementTypeController.create(req, res));
app.put('/elementtypes/:id', (req, res) => elementTypeController.update(req, res));
app.patch('/elementtypes/:id/active', (req, res) => elementTypeController.setActive(req, res));

app.get('/brands', (req, res) => brandController.getAll(req, res));
app.get('/brands/:id', (req, res) => brandController.getById(req, res));
app.post('/brands', (req, res) => brandController.create(req, res));
app.put('/brands/:id', (req, res) => brandController.update(req, res));
app.patch('/brands/:id/active', (req, res) => brandController.setActive(req, res));

export default app;
