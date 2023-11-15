// 인증 및 세션 관련 메소드 정의

import { json, createCookieSessionStorage, redirect } from '@remix-run/node';
import { prisma } from '~/utils/prisma.server';
import bcrypt from 'bcryptjs';
import type { RegisterForm, LoginForm } from '~/utils/types.server';
import { createUser } from '~/utils/user.server';


// 사용자의 세션을 확인해서 
// 세션이 존재하면 성공 -> 아이디 반환
// 세션이 없으면 실패   -> 로그인 화면으로 redirect
export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
    const session = await getUserSession(request);
    const userId = session.get('userId');
    if (!userId || typeof userId !== 'string') {
        const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
        throw redirect(`/login?${searchParams}`);
    }
    return userId;
}

// 요청의 쿠키를 기반으로 현재 사용자의 세션을 가져옴
function getUserSession(request: Request) {
    return storage.getSession(request.headers.get('Cookie'));
}

// 세션 저장소에서 현재 사용자의 ID 반환
async function getUserId(request: Request) {
    const session = await getUserSession(request);
    const userId = session.get('userId');
    if (!userId || typeof userId !== 'string') return null;
    return userId;
}

// 전체 유저 목록에서 현재 세션에 맞는 유저 반환. 존재하지 않을 시 로그아웃
export async function getUser(request: Request) {
    const userId = await getUserId(request);
    if (typeof userId !== 'string') {
        return null;
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, profile: true },
        });
        return user;
    } catch {
        throw logout(request);
    }
}

// 현재 세션을 삭제하고 로그인 화면으로 redirect
export async function logout(request: Request) {
    const session = await getUserSession(request);
    return redirect('/login', {
        headers: {
            'Set-Cookie': await storage.destroySession(session),
        },
    });
}

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

// 로그인이나 회원가입 성공 시 session 생성
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
    // email값이 입력받은 email값과 같은지 비교
    const user = await prisma.user.findUnique({ where: { email } });

    // 유저가 없거나 입력된 비밀번호와 존재하는 계정의 비밀번호를 비교
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return json({ error: '아이디, 비밀번호를 확인해 주세요.' }, { status: 400 });
    }

    return createUserSession(user.id, '/');
}
