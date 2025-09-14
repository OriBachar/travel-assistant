import { RequestHandler } from 'express';
import { z } from 'zod';
import { ZodError } from 'zod';
import { AppError } from '../types/error';
import { asyncHandler } from '../utils/asyncHandler';


const conversationRequestSchema = z.object({
    body: z.object({
        message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
        sessionId: z.string().min(1, 'Session ID is required'),
        userId: z.string().optional(),
        context: z.object({
            destination: z.string().optional(),
            travelDates: z.string().optional(),
            budget: z.string().optional(),
            interests: z.array(z.string()).optional()
        }).optional()
    })
});

export const validateConversationRequest = asyncHandler(async (req, res, next) => {
    try {
        await conversationRequestSchema.parseAsync({
            body: req.body,
        });
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const formattedErrors = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));

            next(new AppError(
                'Validation failed',
                400,
                true,
                { errors: formattedErrors }
            ));
            return;
        }

        next(new AppError('Validation processing failed', 500));
    };
});