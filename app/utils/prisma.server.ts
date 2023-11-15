// DB query를 수행하기 위한 PrismaClient 인스턴스 정의

import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;
declare global {
    var __db: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
    prisma.$connect();
} else {
    if (!global.__db) {
        global.__db = new PrismaClient();
        global.__db.$connect();
    }
    prisma = global.__db;
}

export { prisma };
