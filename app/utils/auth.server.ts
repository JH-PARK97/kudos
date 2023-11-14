import { json, createCookieSessionStorage, redirect } from '@remix-run/node';
import { prisma } from '~/utils/prisma.server';
import type { RegisterForm, LoginForm } from '~/utils/types.server';
import { createUser } from '~/utils/user.server';
import bcrypt from 'bcryptjs';

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error('SESSION_SECRET must be set');
}
const storage = createCookieSessionStorage({
    cookie: {
        name: 'kudos-session',
        secure: process.env.NODE_ENV === 'production',
        secrets: [sessionSecret],
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    },
});

export async function createUserSession(userId: string, redirectTo: string) {
    const session = await storage.getSession();
    session.set('userId', userId);
    return redirect(redirectTo, {
        headers: {
            'Set-Cookie': await storage.commitSession(session),
        },
    });
}

// 회원가입에선 이메일이 이미 등록됐는지 확인 (이메일은 unique값)
export async function register(user: RegisterForm) {
    const emailExists = await prisma.user.count({ where: { email: user.email } });

    if (emailExists) {
        return json({ error: '이메일이 이미 존재합니다.' }, { status: 400 });
    }

    const newUser = await createUser(user);
    if (!newUser) {
        return json(
            {
                error: `유저 등록에 문제가 발생했습니다.`,
                fields: { email: user.email, password: user.password },
            },
            { status: 400 }
        );
    }
    return createUserSession(newUser.id, '/');
}

// email이 일치하지 않거나 비밀번호가 일치하지 않으면 400 에러 발생. 일치하면 id, email을 반환
export async function login({ email, password }: LoginForm) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return json({ error: '아이디, 비밀번호를 확인해 주세요.' }, { status: 400 });
    }

    return createUserSession(user.id, '/');
}
