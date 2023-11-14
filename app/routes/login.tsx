// app/routes/login.tsx
import { useState } from 'react';
import { FormField } from '~/components/form-field';
import { Layout } from '~/components/layout';

export default function Login() {
    const [action, setAction] = useState('login');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFormData((form) => ({ ...form, [field]: event.target.value }));
    };

    console.log(formData);
    return (
        <Layout>
            <div className="h-full justify-center items-center flex flex-col gap-y-4">
                <h2 className="text-5xl font-extrabold text-yellow-300">Welcome to Kudos!</h2>
                <p className="font-semibold text-slate-300">{action === 'login' ? '로그인 해주세요 !' : '회원가입 후 이용 하세요 !'}</p>
                <button
                    onClick={() => setAction(action == 'login' ? 'register' : 'login')}
                    className="absolute top-8 right-8 rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                >
                    {action === 'login' ? '로그인' : '회원가입'}
                </button>
                <form method="post" className="rounded-2xl bg-gray-200 p-6 w-96">
                    <FormField
                        htmlFor="email"
                        label="Email"
                        value={formData.email}
                        onChange={(e) => handleInputChange(e, 'email')}
                    />
                    <FormField
                        htmlFor="password"
                        type="password"
                        label="Password"
                        value={formData.password}
                        onChange={(e) => handleInputChange(e, 'password')}
                    />
                    {action === 'register' && (
                        <>
                            <FormField
                                htmlFor="firstName"
                                label="First Name"
                                onChange={(e) => handleInputChange(e, 'firstName')}
                                value={formData.firstName}
                            />
                            <FormField
                                htmlFor="lastName"
                                label="Last Name"
                                onChange={(e) => handleInputChange(e, 'lastName')}
                                value={formData.lastName}
                            />
                        </>
                    )}

                    <div className="w-full text-center">
                        <button
                            type="submit"
                            name="_action"
                            value={action}
                            className="rounded-xl mt-2 bg-yellow-300 px-3 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                        >
                            {action === 'login' ? '로그인' : '회원가입'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
