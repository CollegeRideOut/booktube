import { db } from '../db';
import * as schema from '../../../../core/src/schema';
import { sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';


const repoName = 'userRepo';

export const userRepo = {
  async getUser(creds: { email: string; password: string }) {
    try {
      const user = await db
        .select()
        .from(schema.users)
        .where(sql`${schema.users.email} = ${creds.email}`)
        .limit(1);

      return user;
    } catch (error) {
      console.log(
        `Error occured on ${repoName} -> ${userRepo.getUser.name} error: ${error}`,
      );
      throw error;
    }
  },

  async getUserById(id: string) {
    try {
      const user = await db
        .select()
        .from(schema.users)
        .where(sql`${schema.users.id} = ${id}`)
        .limit(1);

      return user;
    } catch (error) {
      console.log(
        `Error occured on ${repoName} -> ${userRepo.getUser.name} error: ${error}`,
      );
      throw error;
    }
  },

  async createUser(creds: { name: string; email: string; password: string }) {
    try {
      const hashedPassword = await bcrypt.hash(creds.password, 8);
      const user: typeof schema.users.$inferInsert = {
        id: v4(),
        name: creds.name,
        email: creds.email,
        role: 'ADMIN',
        password: hashedPassword,
      };
      await db.insert(schema.users).values(user);
    } catch (error) {
      console.error(
        `Error occured on ${repoName} -> ${userRepo.createUser.name} error: ${error}`,
      );
      throw error;
    }
  },

  async updateUser(userInfo: {
    id: string;
    name: string;
    email: string;
    password: string;
  }) {
    try {
      const hashedPasword = await bcrypt.hash(userInfo.password, 8);
      const updated = await db
        .update(schema.users)
        .set({
          name: userInfo.name,
          password: hashedPasword,
          email: userInfo.email,
        })
        .where(sql`id = ${userInfo.id}`);
      return true;
    } catch (error) {
      console.error(
        `Error occured on ${repoName} -> ${userRepo.updateUser.name} error: ${error}`,
      );
      throw error;
    }
  },

};
