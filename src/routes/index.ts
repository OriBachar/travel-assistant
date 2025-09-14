import { Router } from 'express';
import conversationRoutes from './conversationRoutes';

const router = Router();

router.use('/conversation', conversationRoutes);

router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Travel Assistant API is running',
        timestamp: new Date().toISOString()
    });
});

export default router;
