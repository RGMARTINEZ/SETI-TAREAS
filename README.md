# 📱 To-Do List App – Prueba Técnica Ionic

Este proyecto es una aplicación móvil desarrollada con **Ionic + Angular**, creada como solución a la prueba técnica para Desarrollador Mobile. La aplicación permite gestionar una lista de tareas con funcionalidades mejoradas, como categorización, filtrado, configuración remota (Remote Config) y almacenamiento persistente.

---

## 🚀 Funcionalidades

- ✅ Crear, editar y eliminar tareas.
- ✅ Marcar tareas como completadas.
- ✅ Eliminar tareas completadas.
- ✅ Crear, editar y eliminar categorías.
- ✅ Asignar categorías a tareas.
- ✅ Filtrar tareas por categoría.
- ✅ Configuración remota (Firebase Remote Config) para activar/desactivar funcionalidades.
- ✅ Optimización para rendimiento y manejo de datos.
- ✅ Exportación de APK e IPA para pruebas en Android e iOS.

---

## 🔧 Tecnologías Utilizadas

- Ionic Framework
- Angular
- Firebase (Remote Config)
- Capacitor (para compatibilidad multiplataforma)
- LocalStorage

---

## 📦 Instalación y Ejecución

### Requisitos Previos

- Node.js (v16 o superior)
- Ionic CLI
- Android Studio (para compilar en Android)
- Xcode (solo para macOS, para compilar en iOS)
- Firebase Console


### Requisitos Previos

- Node.js (v16 o superior) (Versión Utilizada NodeJs V22.17.1)
- Ionic CLI
- Android Studio (para compilar en Android)
- Xcode (solo para macOS, para compilar en iOS)
- Firebase Console

### Clonar el repositorio

```bash
git clone https://github.com/RGMARTINEZ/SETI-PRUEBA-IONIC.git
cd SETI-PRUEBA-IONIC
npm install


### Ejecutar en navegador
ionic serve

### Agregar Plataformas
npx cap add android
npx cap add ios

### Compilar y Sincronizar

onic build
npx cap sync android 
npx cap sync ios 

### Abrir en Android Studio
npx cap open android

### Abrir en Xcode (macOS)
npx cap open ios


### Generar APK (Android) En Android Studio:

Menú Build > Build Bundle(s) / APK(s) > Build APK(s)

El APK estará en android/app/build/outputs/apk/.

Para versión release (firmada):

Menú Build > Generate Signed Bundle / APK

Sigue el asistente para tu keystore.



### Generar IPA (iOS)

En Xcode:

Product > Archive

En Organizer, usa Distribute App para exportar el IPA o subir a App Store Connect.

NOta: Hay que tener una cuenta la cual el costo es de $ 99 dolares. Para poder generar la IPA y exportarla.