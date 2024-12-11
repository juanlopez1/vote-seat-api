# vote-seat-api

## Instalación

Para instalar las dependencias, ejecutá el siguiente comando:

```bash
npm install
```

## Scripts Disponibles

### `dev`

```bash
npm run dev
```

Inicia la API en modo desarrollo. El endpoint que se utiliza es [http://localhost:8080](http://localhost:8080).

### `build`

```bash
npm run build
```

Compila la API y genera la carpeta `dist` con los archivos compilados.

### `start`

```bash
npm start
```

Inicia la API utilizando los archivos compilados de la carpeta `dist`.

### `lint`

```bash
npm run lint
```

Ejecuta el linter de TypeScript para verificar errores de tipo y formatea el código utilizando Biome

### `test`

```bash
npm run test
```

Ejecuta los `tests` utilizando Jest y recopila la cobertura de las pruebas.

### `test:watch`

```bash
npm run test:watch
```

Ejecuta los `tests` en modo "watch".
