import path from 'path';

export const NGINX_CONTAINER_NAME = process.env.NGINX_CONTAINER_NAME ?? 'light-whale-nginx';

export const nginxPath = process.env.NGINX_PATH ?? path.join(process.cwd(), 'nginx-config');

export const configPath = path.join(process.cwd(), 'lw-config');
