
import { SshService } from './ssh.service';
import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { readFileSync } from 'fs';
import { Server, Socket } from 'socket.io';
import { Client } from 'ssh2';
import { PrismaService } from 'src/utils/prisma/prisma.service'; // Assuming you're using Prisma for DB access

@WebSocketGateway(3001, { cors: "*", namespace: "socket.io" })
export class SshGateway {
  constructor(private readonly sshService: SshService, private readonly prisma: PrismaService) { }

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  @SubscribeMessage('start-ssh-session')
  async handleSshSession(client: Socket, payload: { serverId: string }) {
    const serverData = await this.prisma.server.findUnique({
      where: { id: payload.serverId },
      select: {
        ssh_username: true,
        ssh_password: true,
        ssh_key: true,
        ssh_host: true,
        ssh_port: true,
      },
    });

    if (!serverData) {
      client.emit('data', 'Server not found');
      return;
    }

    const conn = new Client();
    const connectionOptions: any = {
      host: serverData.ssh_host,
      port: serverData.ssh_port,
      username: serverData.ssh_username,
    };

    if (serverData.ssh_password) {
      connectionOptions.password = serverData.ssh_password;
    } else if (serverData.ssh_key) {
      connectionOptions.privateKey = readFileSync(serverData.ssh_key); // Assuming ssh_key is a file path
    }

    conn.on('ready', () => {
      conn.shell((err, stream) => {
        if (err) {
          client.emit('data', `Error starting shell: ${err.message}`);
          return;
        }

        stream.on('data', (data) => {
          client.emit('data', data.toString());
        });

        client.on('input', (input: string) => {
          stream.write(input);
        });

        stream.on('close', () => {
          client.emit('data', 'Session closed');
          conn.end();
        });
      });
    }).connect(connectionOptions);

    conn.on("error", (err) => {
      client.emit("data", `Error connecting to SSH server: ${err.message}`);
    });
  }
}

