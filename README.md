# 💬 Terminal Chat por WebSockets (con Roles de Usuario y Administrador)

Un sistema de chat por terminal en tiempo real, construido con **Bun** y **WebSockets**, que permite la interacción entre múltiples usuarios con una interfaz visual mejorada, colores personalizados y soporte para comandos administrativos.

---

## 🚀 Características

- ✅ Conexión de múltiples usuarios vía terminal.
- 🧑‍💻 Diferenciación entre **usuarios** y **administradores** mediante contraseña.
- 🔒 Contraseña protegida para acceso como administrador.
- 🎨 Interfaz visual con `chalk`, `figlet` y `gradient-string`.
- 🧠 Comandos exclusivos para administradores:
  - `/usuarios`: Ver usuarios conectados.
  - `/anuncio [mensaje]`: Enviar mensaje global.
  - `/expulsar [nombre]`: Expulsar un usuario del chat.

---

## 📦 Requisitos

- [Bun](https://bun.sh/) instalado en tu sistema.
- Terminal de comandos compatible (cmd, PowerShell, Windows Terminal, etc.).

---

## 📁 Instalación y Ejecución

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Deybi2/chat_con_websocket.git
   cd chat_con_websocket
   ```

2. Instala dependencias:
   ```bash
   bun install
   ```

3. Ejecuta el **servidor**:
   ```bash
   bun server.js
   ```

4. En otra terminal, ejecuta el **cliente**:
   ```bash
   bun client.js
   ```

---

## 🔐 Contraseña de Administrador

La contraseña para acceder como administrador está definida dentro del archivo `server.js`:
```js
const ADMIN_PASSWORD = 'supersecret123';
```
Puedes modificarla según tu preferencia.

---

## 💡 Ejemplo de Uso

```
> Escribe tu nombre de usuario: Deybi
> Contraseña (solo para administradores): supersecret123

[Servidor]: Acceso como administrador concedido.
[Comandos de administrador disponibles]:
  /usuarios
  /anuncio [mensaje]
  /expulsar [nombre]

Deybi> /anuncio ¡Bienvenidos al chat!
```