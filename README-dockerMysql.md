# Configuración de MySQL en Docker con Autorización Manual

Este documento proporciona los pasos para crear un contenedor MySQL en Docker y otorgar permisos manualmente a cada usuario en cada nueva instancia.

## 1️⃣ Crear el contenedor MySQL desde un archivo `docker-compose.yml`

Crea un archivo `docker-compose.yml` con el siguiente contenido:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: my-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: mydatabase
      MYSQL_USER: myuser
      MYSQL_PASSWORD: mypassword
    ports:
      - "3306:3306"
    command: --default-authentication-plugin=mysql_native_password
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

Ejecuta el siguiente comando para levantar el contenedor:

```sh
docker-compose up -d
```

## 2️⃣ Acceder al contenedor MySQL
Sustituye NOMBRE_DEL_CONTENEDOR con el nombre real de tu contenedor MySQL

```sh
docker exec -it NOMBRE_DEL_CONTENEDOR mysql -u root -p
```

Cuando se te pida la contraseña, ingresa `rootpassword` (o la que hayas definido en el `docker-compose.yml`).

## 3️⃣ Otorgar permisos manualmente al usuario

Dentro de MySQL, ejecuta los siguientes comandos:

```sql
GRANT ALL PRIVILEGES ON mydatabase.* TO 'myuser'@'%' IDENTIFIED BY 'mypassword';
FLUSH PRIVILEGES;
```

## 4️⃣ Configurar Prisma para conectarse a MySQL

Edita el archivo `.env` de tu proyecto Prisma y agrega la URL de conexión:

```ini
DATABASE_URL="mysql://myuser:mypassword@localhost:3306/mydatabase"
```

## 5️⃣ Ejecutar las migraciones de Prisma

```sh
npx prisma migrate dev
```

Si hay errores, verifica los permisos del usuario y asegúrte de que la base de datos existe.

## 6️⃣ (Opcional) Verificar la conexión a la base de datos

Para comprobar que Prisma puede conectarse correctamente:

```sh
npx prisma db pull
```

Esto sincronizará el esquema de la base de datos con tu `schema.prisma`.

---

Con estos pasos, podrás configurar un nuevo contenedor MySQL y otorgar permisos manualmente a cada usuario en cada instancia en Linux. 🚀

