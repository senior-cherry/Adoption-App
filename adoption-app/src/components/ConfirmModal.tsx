import {
    Button,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import DeleteButton from "@/components/DeleteButton";
import {useTranslations} from "next-intl";

type ModalProps = {
    id: string;
    collection: string;
    isIcon?: boolean;
    onDeleteSuccess?: () => void;
};

const ConfirmModal = ({ id, collection, isIcon, onDeleteSuccess }: ModalProps) => {
    const t = useTranslations("confirm-modal");
    const [isOpen, setIsOpen] = useState(false);
    const cancelRef = useRef<HTMLButtonElement>(null);

    return (
        <>
            {isIcon ? (
                <DeleteIcon onClick={() => setIsOpen(true)} className="mr-4 cursor-pointer hover:text-red-400" />
            ) : (
                <Button colorScheme='red' onClick={() => setIsOpen(true)}>{t("btnTitle")}</Button>
            )}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsOpen(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader>{t("alertHeader")}</AlertDialogHeader>
                        <AlertDialogBody>
                            {t("alertBody")}
                        </AlertDialogBody>
                        <AlertDialogFooter className="flex gap-3">
                            <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                                {t("cancelBtn")}
                            </Button>
                            <DeleteButton id={id} collection={collection} onDeleteSuccess={() => {
                                onDeleteSuccess?.();
                                setIsOpen(false);
                            }} />
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default ConfirmModal;
