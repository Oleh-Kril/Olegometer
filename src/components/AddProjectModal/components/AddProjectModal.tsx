import Modal from '../../../ui/Modal'
import AddProjectForm from './AddProjectForm'

type Props = {
    showModal: boolean
    setShowModal: (value: boolean) => void
}

export default function AddProjectModal({showModal, setShowModal}: Props) {
    const closeModal = () => setShowModal(false)

    return (
        <Modal showModal={showModal}
            onRequestClose={closeModal}>
            <AddProjectForm onSuccess={closeModal}/>
        </Modal>
    )
}
