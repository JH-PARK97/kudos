interface FormFieldProps {
    htmlFor: string;
    label: string;
    type?: string;
    value: any;
    onChange?: (...args: any) => any;
}

export function FormField({ htmlFor, label, value, type = 'text', onChange = () => {} }: FormFieldProps) {
    return (
        <>
            <label htmlFor={htmlFor} className="text-blue-600 font-semibold">
                {label}
            </label>
            <input
                onChange={onChange}
                value={value}
                name={htmlFor}
                type={type}
                id={htmlFor}
                className="w-full p2 rounded-xl my-2"
            />
        </>
    );
}
