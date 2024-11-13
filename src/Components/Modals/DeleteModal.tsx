import { motion } from "framer-motion";
import OutlineButton from "../Buttons/OutlineButton";

export interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    onConfirm,
}) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0 }}
            className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full bg-[#3D3D3D]/40"
        >
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-400">
                            {title}
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            ×
                        </button>
                    </div>
                    <div className="p-5">
                        <h1 className="text-lg text-black dark:text-gray-400">{message}</h1>
                    </div>
                    <div className='flex justify-end p-5 gap-2'>
                        <OutlineButton type='reset' title='Cancel' onclick={onClose} />
                        <OutlineButton type='button' title='Delete' onclick={onConfirm} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DeleteModal;
