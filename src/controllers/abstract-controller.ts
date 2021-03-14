import express from 'express';

export interface AbstractController {
    handle: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
}
