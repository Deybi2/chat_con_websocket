// ================================
// Terminal Chat - Servidor (server.js)
// ================================

import { WebSocketServer } from 'ws';
import chalk from 'chalk';
import gradient from 'gradient-string';

const PORT = 8080;
const ADMIN_PASSWORD = 'supersecret123'; // Contraseña de administrador

const wss = new WebSocketServer({ port: PORT });
console.log(gradient.pastel(`\n[Servidor iniciado] Escuchando en ws://localhost:${PORT}\n`));

// Mapa para almacenar los clientes y su información
const clients = new Map(); // WebSocket => { name, isAdmin }

wss.on('connection', (ws) => {
  let userInfo = { name: '', isAdmin: false };

  // Paso 1: Pedir nombre de usuario
  ws.send(chalk.cyan('[Servidor] Bienvenido. Por favor, escribe tu nombre de usuario:'));

  // Estado para saber en qué fase de autenticación está el usuario
  let awaitingUsername = true;
  let awaitingPassword = false;

  ws.on('message', (data) => {
    const message = data.toString().trim();

    // Fase 1: Obtener nombre
    if (awaitingUsername) {
      userInfo.name = message;
      awaitingUsername = false;
      awaitingPassword = true;
      ws.send(chalk.cyan('Contraseña (solo para administradores, dejar vacío si eres usuario común):'));
      return;
    }

    // Fase 2: Verificar contraseña (o continuar como usuario)
    if (awaitingPassword) {
      if (message === ADMIN_PASSWORD) {
        userInfo.isAdmin = true;
        ws.send(chalk.green('[Servidor] Acceso como administrador concedido.'));
        mostrarComandosAdmin(ws);
      } else if (message === '') {
        ws.send(chalk.green('[Servidor] Conectado como usuario.'));
      } else {
        ws.send(chalk.red('[Servidor] Contraseña incorrecta. Acceso como administrador denegado. Continuarás como usuario.'));
      }

      clients.set(ws, userInfo);
      broadcast(chalk.yellow(`[Servidor]: "${userInfo.name}" se ha unido al chat.`), ws);
      awaitingPassword = false;
      return;
    }

    // Si ya está autenticado, manejar comandos o mensajes
    if (userInfo.isAdmin && message.startsWith('/')) {
      handleAdminCommand(message, ws);
      return;
    }

    broadcast(`${chalk.blue(userInfo.name)}: ${message}`, ws);
  });

  ws.on('close', () => {
    if (clients.has(ws)) {
      const { name } = clients.get(ws);
      clients.delete(ws);
      broadcast(chalk.red(`[Servidor]: "${name}" ha salido del chat.`));
    }
  });
});

// ================================
// Funciones Auxiliares
// ================================

function broadcast(message, sender = null) {
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  }
  console.log(message);
}

function mostrarComandosAdmin(ws) {
  ws.send(chalk.magentaBright(`\n[Comandos de administrador disponibles]:
  /usuarios - Ver lista de usuarios conectados
  /anuncio [mensaje] - Enviar mensaje global
  /expulsar [nombre] - Desconectar a un usuario\n`));
}

function handleAdminCommand(command, ws) {
  const { name: adminName } = clients.get(ws);

  if (command === '/usuarios') {
    const lista = [...clients.values()].map(u => u.name).join(', ');
    ws.send(chalk.blue(`[Servidor] Usuarios conectados: ${lista}`));
  } else if (command.startsWith('/anuncio ')) {
    const msg = command.replace('/anuncio ', '').trim();
    broadcast(chalk.bgYellow.black(`[Anuncio de ${adminName}]: ${msg}`));
  } else if (command.startsWith('/expulsar ')) {
    const targetName = command.replace('/expulsar ', '').trim();
    const targetEntry = [...clients.entries()].find(([, info]) => info.name === targetName);
    if (targetEntry) {
      const [targetWs] = targetEntry;
      targetWs.send(chalk.red('[Servidor] Has sido expulsado del chat por un administrador.'));
      targetWs.close();
    } else {
      ws.send(chalk.red(`[Servidor] Usuario "${targetName}" no encontrado.`));
    }
  } else {
    ws.send(chalk.red('[Servidor] Comando no reconocido. Usa /usuarios, /anuncio o /expulsar.'));
  }
}
