import { useAtom } from 'jotai'
import { atomWithReset } from 'jotai/utils'

const confirmationModalAtom = atomWithReset(
    {
        showModal: false,
        modalTitle: 'Confirm action ?',
        onConfirm: () => {}
    }
)

const useConfirmationModal = () => useAtom(confirmationModalAtom)

export default useConfirmationModal
