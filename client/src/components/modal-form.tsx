import styled from "@emotion/styled";
import { FC } from "react";
import Modal, { ModalProps } from "./modal";

interface ModalFormProps extends ModalProps {
  hide: () => void
  heading: string
  onSubmit: () => void
}

const ModalForm: FC<ModalFormProps> = ({hide, children, heading, onSubmit}) => (
    <Modal hide={hide} heading={heading}>
        <form onSubmit={onSubmit}>
            {children}
        </form>
    </Modal>
);


export default ModalForm;