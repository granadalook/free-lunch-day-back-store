# Etapa 1: Construcción
FROM node:18 AS builder

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala todas las dependencias (producción y desarrollo)
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila el proyecto
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia solo los archivos necesarios desde la etapa de construcción
COPY package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

# Instala solo las dependencias de producción
RUN npm install --only=production

# Exponer el puerto en el que corre tu aplicación
EXPOSE 3000

# Comando para ejecutar tu aplicación
CMD ["node", "dist/main"]
