// Sites supplies Vite-specific flags; Next owns its equivalent host/port options.
import { spawn } from 'node:child_process';
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', process.argv.includes('--production') || process.env.CONNECT_PREVIEW_PRODUCTION === '1' ? 'start' : 'dev', '--hostname', '0.0.0.0', '--port', '4173'], { stdio: 'inherit', env: process.env });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', code => process.exit(code ?? 1));
