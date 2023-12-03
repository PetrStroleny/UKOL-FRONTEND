import styled from "@emotion/styled";
import { FC, useEffect } from "react";
import {useKeyboardControl} from "../utils/events";

export interface ModalProps {
  hide: () => void
  children: JSX.Element | JSX.Element[]
  heading: string
}

const Modal: FC<ModalProps> = ({hide, children, heading}) => {

  const [onMount, onCleanup] = useKeyboardControl({
    onCancel: hide,
  });

  useEffect(() => {
    onMount(window);

    return () => onCleanup(window);
  }, [])

  return(
    <Wrapper onClick={hide}>
        <Content className="primary-background" onClick={(e) => e.stopPropagation()}>
            <Header>
                {heading}
            </Header>
            {children}
        </Content>
    </Wrapper>
  );
}

const Wrapper = styled("div")`
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  background: rgb(238,238,238,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;
`;

const Content = styled("div")`
  border-radius: 20px;
  padding: 20px;
  width: 600px;
  border-radius: 12px;
  max-height: calc(100% - 80px);
  overflow-y: auto;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 15px;
  display: flex;
  position: relative;
  flex-direction: column;
`;

const Header = styled("h4")`
  ${p => p.theme.fontStyles.h4};
  padding-bottom: 15px;
`;

export const ModalDescription = styled("p")`
  padding-top: 20px;
  ${p => p.theme.fontStyles.b2};
`;

export const ModalButtons = styled("div")`
  display: flex;
  padding-top: 30px;
  justify-content: space-between;

  > div {
    display: flex;
    gap: 12px;
  }
`;

export default Modal;