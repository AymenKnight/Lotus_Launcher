import { Child, Command } from '@tauri-apps/api/shell';

async function syncCommandSpawn(command: Command) {
  const child = await command.spawn();
  const stdoutStream: string[] = [];
  const stderrStream: string[] = [];

  return new Promise<
    | {
        isError: true;
        stderr: string[];
      }
    | {
        isError: false;
        stdout: string[];
      }
  >((resolve, reject) => {
    command.stdout.on('data', async (data: string) => {
      stdoutStream.push(data);
    });
    command.stderr.addListener('data', async (data: string) => {
      stderrStream.push(data);
    });
    command.on('error', async (data) => {
      await child.kill().catch(() => {});
      resolve({ isError: true, stderr: stderrStream });
    });
    command.on('close', async (s) => {
      await child.kill().catch(() => {});
      console.log(s);
      if (stderrStream.length > 0)
        resolve({ isError: true, stderr: stderrStream });
      else resolve({ isError: false, stdout: stdoutStream });
    });
    setTimeout(async () => {
      await child.kill().catch(() => {
        reject({
          isError: true,
          stderr: stderrStream,
          stdout: stdoutStream,
        });
      });
    }, 30000);
  });
}
export class DbServerLauncher {
  private INIT_PARAMS: string[];

  private START_PARAMS: string[];

  private STOP_PARAMS: string[];

  private CREATE_DB_PARAMS: string[];

  private DUMP_SQL: string[];

  private TEST_TABLES: string[];

  private TEST_DB: string[];

  constructor(props: {
    dataDir: string;
    username: string;
    port: string;
    dbName: string;
    logFile: string;
    migrationFile: string;
  }) {
    this.INIT_PARAMS = [
      '-D', // database cluster directory
      props.dataDir,
      '-U', //master user
      props.username,
      // '--pwfile', use for password file
      // json, // use for password file
      '-E', //encoding
      'UTF8',
      '-A', //auth method
      'trust', //change when using a password file and for host authentication
    ];
    this.START_PARAMS = ['-D', props.dataDir, '-l', props.logFile, 'start'];
    this.STOP_PARAMS = ['-D', props.dataDir, 'stop'];
    this.CREATE_DB_PARAMS = [
      '-h', //host
      'localhost', //don't change this unless you know what you are doing
      '-p', //port
      props.port,
      '-U', //user
      props.username,
      '-w', // use "W" when using a password file
      props.dbName,
    ];
    this.DUMP_SQL = props.migrationFile
      ? ['-U', props.username, '-d', props.dbName, '-f', props.migrationFile]
      : [];
    this.TEST_TABLES = [
      '-U',
      props.username,
      '-d',
      props.dbName,
      '-c',
      'select 1 from "Member"',
    ];
    this.TEST_DB = [
      '-U', //user
      props.username,
      '-c', //query for testing existence of database
      "select 1 from pg_database where datname='mydb'",
    ];
  }

  async isDbReady() {
    const command = new Command('pg_isReady');
    const result = await syncCommandSpawn(command);
    console.log('isDbReady', result);
    if (result.isError) return false;
    else {
      if (result.stdout.join(' ').includes('no response')) return false;
      else return true;
    }
  }

  async isDbExist() {
    const command = new Command('psql:db', this.TEST_DB);
    const result = await syncCommandSpawn(command);
    console.log('isDbExist', result);
    if (result.isError) return false;
    else {
      if (result.stdout.join(' ').includes('1 row')) return true;
      else return false;
    }
  }

  async isDbMigrated() {
    const command = new Command('psql:table', this.TEST_TABLES);
    const result = await syncCommandSpawn(command);
    console.log('isDbMigrated', result);
    if (result.isError) return false;
    else {
      if (result.stdout.join(' ').includes('row')) return true;
      else return false;
    }
  }

  async startServer({
    onServerStarted,
    onServerStopped,
  }: {
    onServerStarted?: () => void;
    onServerStopped?: () => void;
  }) {
    const command = new Command('pg_ctl:start', this.START_PARAMS);

    const child = await command.spawn();
    return new Promise<Child>((resolve, reject) => {
      command.stdout.on('data', async (data: string) => {
        if (data.includes('done')) {
          onServerStarted?.();
          resolve(child);
        }
      });
      command.stderr.addListener('data', async (data: string) => {
        console.log(data);
        if (data.includes('done')) resolve(child);
      });

      command.on('error', async (data) => {
        onServerStopped?.();
        resolve(child);
      });
      command.on('close', async (data) => {
        onServerStopped?.();
        console.log(data);
        resolve(child);
      });
    });
  }

  async stopServer() {
    const command = new Command('pg_ctl:stop', this.STOP_PARAMS);
    const result = await syncCommandSpawn(command);
    console.log(result);
    if (result.isError) {
      if (result.stderr.join(' ').includes('No such process')) return true;
      else return false;
    } else {
      if (result.stdout.join(' ').includes('done')) return true;
      else return false;
    }
  }

  async initServer() {
    const command = new Command('initdb', this.INIT_PARAMS);
    const result = await syncCommandSpawn(command);
    console.log(result);
    if (result.isError) return false;
    else {
      return true;
    }
  }

  async createDb() {
    const command = new Command('createdb', this.CREATE_DB_PARAMS);
    console.log(this.CREATE_DB_PARAMS);
    const result = await syncCommandSpawn(command);
    console.log("createDb", result);
    if (result.isError) return false;
    else {
      return await this.migrateDb();
    }
  }

  async migrateDb() {
    const command = new Command('psql:migrate', this.DUMP_SQL);
    const result = await syncCommandSpawn(command);
    console.log("migrateDb", result);
    if (result.isError) return false;
    else {
      return true;
    }
  }
}
