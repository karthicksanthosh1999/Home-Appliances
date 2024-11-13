export interface ICreateModalProps {
    name: string;
    label: string;
    type: "text" | "number" | "email" | "select";
    options?: { label: string; value: string | number }[];
    required?: boolean;
}

export interface IFormModalProps<T> {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: { [key: string]: any }) => void;
    fields: ICreateModalProps[];
    initalValues: T
}