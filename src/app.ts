import express, { Application } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import errorMiddleware from '@/middleware/error.middleware';
import compression from 'compression';
import mongoose from 'mongoose';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

class App {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initializeDatabaseConnection();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandler();
    }

    private initializeMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api/v1', controller.router);
        });
    }

    private initializeErrorHandler(): void {
        this.express.use(errorMiddleware);
    }

    private initializeDatabaseConnection(): void {
        const username = encodeURIComponent(process.env.MONGO_USERNAME as string);
        const password = encodeURIComponent(process.env.MONGO_PASSWORD as string);
        const cluster = process.env.MONGO_CLUSTER;
        const connectionString = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority`;

        mongoose.set('strictQuery', true);
        mongoose.connect(connectionString);
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`The application is listening on port ${this.port}`);
        });
    }
}

export default App;
