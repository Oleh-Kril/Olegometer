import { useAtom } from 'jotai'
import { atomWithReset } from 'jotai/utils'

const globalLoaderAtom = atomWithReset(
    {
        showLoader: false,
        text: 'Loading...',
    }
)

const useGlobalLoader = () => useAtom(globalLoaderAtom)

export default useGlobalLoader
