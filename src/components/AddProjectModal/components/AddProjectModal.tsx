import Modal from '../../../ui/Modal'
import AddProjectForm from './AddProjectForm'

type Props = {
    showModal: boolean
    setShowModal: (value: boolean) => void
}

function AddProjectModal({showModal, setShowModal}: Props) {
    return (
        <Modal showModal={showModal}
            onRequestClose={() => setShowModal(false)}>
            <AddProjectForm />
        </Modal>
    )
}


export default AddProjectModal
