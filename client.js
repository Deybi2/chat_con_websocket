// ================================
// Terminal Chat - Cliente (client.js)
// ================================

import { WebSocket } from 'ws';
import readline from 'readline';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';

// Creamos la interfaz para entrada y salida en la terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let socket;
let username = '';
let authenticated = false;

// Mostrar título con figlet y gradient
console.clear();
console.log(gradient.rainbow(figlet.textSync('Terminal Chat', { horizontalLayout: 'default' })));

// Función para conectarse al servidor WebSocket
function conectarAlServidor() {
  socket = new WebSocket('ws://localhost:8080');

  socket.on('open', () => {
    pedirNombre();
  });

  socket.on('message', (data) => {
    const message = data.toString();

    // Borra la línea actual para que los mensajes entrantes no interfieran
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    console.log(message);

    // Vuelve a mostrar el prompt del usuario
    if (authenticated) rl.prompt();
  });

  socket.on('close', () => {
    console.log(chalk.red('\n[Desconectado del servidor]'));
    process.exit(0);
  });

  rl.on('line', (line) => {
    const input = line.trim();
    if (input && authenticated) {
      socket.send(input);
    }
    rl.prompt();
  });
}

// Paso 1: Pedir nombre de usuario
function pedirNombre() {
  rl.question(chalk.cyan('Escribe tu nombre de usuario: '), (name) => {
    username = name.trim();
    socket.send(username); // Enviamos el nombre al servidor
    pedirContrasena();
  });
}

// Paso 2: Pedir contraseña solo si se quiere ser admin
function pedirContrasena() {
  rl.question(chalk.yellow('Contraseña (solo para administradores): '), (pass) => {
    socket.send(pass.trim()); // Enviamos la contraseña al servidor
    authenticated = true; // Permitimos mensajes después de este paso
    rl.setPrompt(chalk.magenta(`${username}> `));
    rl.prompt();
  });
}

// Iniciar conexión
conectarAlServidor();
