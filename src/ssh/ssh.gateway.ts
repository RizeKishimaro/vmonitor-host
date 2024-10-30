import { SshService } from './ssh.service';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Client } from 'ssh2';

@WebSocketGateway(3001, { cors: '*', namespace: 'socket.io' })
export class SshGateway {
  constructor(private readonly sshService: SshService) {}
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  @SubscribeMessage('start-ssh-session')
  handleSshSession(
    client: Socket,
    payload: { host: string; username: string; password?: string },
  ) {
    console.log(payload);
    const conn = new Client();

    conn
      .on('ready', () => {
        console.log('SSH Connection ready');

        // Start a shell session
        conn.shell((err, stream) => {
          if (err) {
            client.emit('data', `Error starting shell: ${err.message}`);
            return;
          }

          // Handle incoming data from the SSH session and send it to the client
          stream.on('data', (data) => {
            client.emit('data', data.toString());
          });

          // Listen for incoming data from the client and send it to the SSH session
          client.on('input', (input: string) => {
            stream.write(input);
          });

          stream.on('close', () => {
            client.emit('data', 'Session closed');
            conn.end();
          });
        });
      })
      .connect({
        host: payload.host,
        port: 22,
        username: payload.username,
        password: payload.password, // Optional: Can use SSH keys as well.
      });
    conn.on('error', (err) => {
      console.log(err);
      client.emit('data', `Error connecting to SSH server: ${err.message}`);

    });
  }
}
