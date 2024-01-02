import styles from '../styles/EyeButton.module.scss'
import {MouseEventHandler} from 'react'

type Props = {
    onClick: MouseEventHandler<HTMLButtonElement>,
    className?: string,
}

export default function EyeButton({className='', ...props}: Props) {
    return (
        <button className={`${className} ${styles.eyeButton}`}
            {...props}>
            <img src="/icons/eye-solid.svg"
                alt="view" />
        </button>
    )
}
