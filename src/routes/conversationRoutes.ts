import { Router } from 'express';
import { conversationController } from '../controllers/conversationController';
import { body, validationResult } from 'express-validator';

const router = Router();

const validateConversationRequest = [
    body('message')
        .isString()
        .isLength({ min: 1, max: 1500 })
        .withMessage('Message must be a string between 1 and 1500 characters'),
    body('sessionId')
        .isString()
        .isLength({ min: 1, max: 100 })
        .withMessage('SessionId must be a string between 1 and 100 characters'),
    body('userId')
        .optional()
        .isString()
        .isLength({ min: 1, max: 100 })
        .withMessage('UserId must be a string between 1 and 100 characters'),
    (req: any, res: any, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }
        next();
    }
];

router.post('/chat', validateConversationRequest, conversationController.handleConversation.bind(conversationController));
router.get('/health', conversationController.getHealth.bind(conversationController));

export default router;
