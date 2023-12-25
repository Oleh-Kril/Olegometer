"use client"

import Modal from "../../../ui/Modal"
import useConfirmationModal from "../../../store/confirmationModalStore"
import {RESET} from "jotai/utils"
import {createPortal} from "react-dom"
import {useEffect, useState} from "react"

type Props = {

}

function ConfirmationModal({}: Props){
    const [mounted, setMounted] = useState(false);
    const [confirmationModal, setConfirmationModal] = useConfirmationModal()

    useEffect(() => setMounted(true), []);

    function onModalResetHandler(){
        setConfirmationModal(RESET)
    }

    return mounted ? createPortal(
        <Modal showModal={confirmationModal.showModal} onRequestClose={onModalResetHandler}>
            <button onClick={confirmationModal.onConfirm}>OK</button>
            <p>{confirmationModal.modalTitle}</p>
        </Modal>,
        document.getElementById('modal-root') || document.body
    ) : null
}

export default ConfirmationModal
