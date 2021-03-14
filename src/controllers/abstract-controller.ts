import {Application} from 'express';

export interface AbstractController {
    setupRoutes(app: Application): void;
}
