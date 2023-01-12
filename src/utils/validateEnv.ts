import { cleanEnv, str, port } from 'envalid';

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({ choices: ['development', 'production'] }),
        MONGO_USERNAME: str(),
        MONGO_PASSWORD: str(),
        MONGO_CLUSTER: str(),
        JWT_SECRET: str(),
        PORT: port({ default: 3000 })
    });
}

export default validateEnv;
