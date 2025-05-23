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

type ModalProps = {
    id: string;
    collection: string;
    isIcon?: boolean;
};

const ConfirmModal = ({ id, collection, isIcon }: ModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const cancelRef = useRef<HTMLButtonElement>(null);

    return (
        <>
            {isIcon ? (
                <DeleteIcon onClick={() => setIsOpen(true)} className="mr-4 cursor-pointer hover:text-red-400" />
            ) : (
                <Button colorScheme='red' onClick={() => setIsOpen(true)}>Видалити</Button>
            )}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsOpen(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader>Confirm Deletion</AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure you want to delete this item? This action cannot be undone.
                        </AlertDialogBody>
                        <AlertDialogFooter className="flex gap-3">
                            <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <DeleteButton id={id} collection={collection} />
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default ConfirmModal;
