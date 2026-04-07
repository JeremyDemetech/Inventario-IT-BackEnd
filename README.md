Inventario IT - Backend

Estructura base usando Clean Architecture y conexión a SQL Server (sin Prisma).

Instalación rápida:

```bash
npm install
# copiar .env.example a .env y configurar credenciales SQL Server
npm run dev
```

HTTPS (desarrollo)
 - Para servir por HTTPS coloca la ruta de tu clave y certificado en el `.env`:
	 - `SSL_KEY_PATH=./certs/server.key`
	 - `SSL_CERT_PATH=./certs/server.crt`
 - Puedes generar un certificado autofirmado con OpenSSL (en Windows PowerShell con OpenSSL instalado):

```powershell
mkdir certs
openssl req -x509 -newkey rsa:4096 -nodes -keyout certs/server.key -out certs/server.crt -days 365 -subj "/CN=localhost"
```

 - Después copia `.env.example` a `.env`, actualiza rutas y arranca:

```powershell
copy .env.example .env
# editar .env para agregar SSL_KEY_PATH y SSL_CERT_PATH
npm run dev
```

 - Si el servidor no encuentra los archivos iniciará en HTTP y mostrará un mensaje en consola.

Archivos importantes:
- [src/config](src/config)
- [src/infrastructure/db/sqlserver/connection.ts](src/infrastructure/db/sqlserver/connection.ts)
- [src/infrastructure/repositories/SqlUserRepository.ts](src/infrastructure/repositories/SqlUserRepository.ts)
- [src/usecases/GetUserByIdUseCase.ts](src/usecases/GetUserByIdUseCase.ts)
- [src/interfaces/controllers/UserController.ts](src/interfaces/controllers/UserController.ts)

Sigue el README para más detalles.
# Inventario-IT-BackEnd
