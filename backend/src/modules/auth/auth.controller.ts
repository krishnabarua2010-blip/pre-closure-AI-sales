import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma';
import { signupSchema, loginSchema } from './auth.schema';
import crypto from 'crypto';

export class AuthController {
  static async signup(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parsedBody = signupSchema.parse(request.body);
      
      const existingUser = await prisma.user.findUnique({
        where: { email: parsedBody.email }
      });

      if (existingUser) {
        return reply.code(400).send({ error: 'Email already exists' });
      }

      const password_hash = await bcrypt.hash(parsedBody.password, 10);
      
      // Auto-generate unique slug based on company name
      const baseSlug = parsedBody.company_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const uniqueSuffix = crypto.randomBytes(3).toString('hex');
      const slug = `${baseSlug}-${uniqueSuffix}`;
      const public_token = crypto.randomBytes(16).toString('hex');

      const user = await prisma.user.create({
        data: {
          email: parsedBody.email,
          password_hash,
          BusinessProfiles: {
            create: {
              company_name: parsedBody.company_name,
              industry: parsedBody.industry || null,
              slug,
              public_token
            }
          }
        },
        include: { BusinessProfiles: true }
      });

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is required");
      }
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return reply.code(201).send({
        message: 'Account created successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          plan: user.plan,
          businessProfile: user.BusinessProfiles[0]
        }
      });
    } catch (error: any) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.code(400).send({ error: 'Validation failed', details: JSON.parse(error.message) });
      }
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }

  static async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parsedBody = loginSchema.parse(request.body);
      
      const user = await prisma.user.findUnique({
        where: { email: parsedBody.email },
        include: { BusinessProfiles: true }
      });

      if (!user) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(parsedBody.password, user.password_hash);
      if (!isMatch) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is required");
      }
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return reply.send({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          plan: user.plan,
          usage: { used: user.messages_used, limit: user.message_limit },
          businessProfile: user.BusinessProfiles[0]
        }
      });
    } catch (error: any) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.code(400).send({ error: 'Validation failed', details: JSON.parse(error.message) });
      }
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }

  static async guest(request: FastifyRequest, reply: FastifyReply) {
    try {
      const guestId = crypto.randomBytes(4).toString('hex');
      const email = `guest_${guestId}@preview.local`;
      const password = crypto.randomBytes(8).toString('hex');
      const password_hash = await bcrypt.hash(password, 10);
      
      const slug = `guest-preview-${guestId}`;
      const public_token = crypto.randomBytes(16).toString('hex');

      const user = await prisma.user.create({
        data: {
          email,
          password_hash,
          message_limit: 15,
          BusinessProfiles: {
            create: {
              company_name: 'Guest Business (Preview)',
              industry: 'SaaS',
              slug,
              public_token
            }
          }
        },
        include: { BusinessProfiles: true }
      });

      if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required");
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return reply.code(201).send({
        message: 'Guest session created',
        token,
        user: {
          id: user.id,
          email: user.email,
          plan: user.plan,
          usage: { used: user.messages_used, limit: user.message_limit },
          businessProfile: user.BusinessProfiles[0]
        }
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to create guest session' });
    }
  }
}
