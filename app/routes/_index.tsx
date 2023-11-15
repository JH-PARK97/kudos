import { type LoaderFunctionArgs } from '@remix-run/node';
import { requireUserId } from '~/utils/auth.server';

export const loader = async (args: LoaderFunctionArgs) => {
    await requireUserId(args.request);
    return null;
};

export default function Index() {
    return (
        <div className="h-screen bg-slate-700 flex justify-center items-center">
            <h2 className="text-blue-600 font-extrabold text-5xl">TailwindCSS Is Working!</h2>
        </div>
    );
}
