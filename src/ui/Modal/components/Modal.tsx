import React, {MouseEventHandler, ReactNode} from "react"
import styles from '../styles/Modal.module.scss'

export type ModalProps = {
    showModal: boolean,
    onRequestClose: MouseEventHandler<HTMLDivElement | HTMLButtonElement>,
    children: ReactNode
}

function Modal({ showModal, onRequestClose, children }: ModalProps){
    return (
        <>
            {showModal ? (
                <div className={styles.modalBackground} onClick={onRequestClose}>
                    <div className={styles.modalBody} onClick={(e) => e.stopPropagation()}>
                        <button onClick={onRequestClose}>Close Modal</button>
                        {children}
                    </div>
                </div>
            ) : false}
        </>
    )
}

export default Modal
