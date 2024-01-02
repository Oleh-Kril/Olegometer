import styles from '../styles/RunButton.module.scss'
import {MouseEventHandler} from 'react'

type Props = {
    onClick: MouseEventHandler<HTMLButtonElement>,
    className: string,
    isDoubleIcon?: boolean
}

export default function RunButton({className, isDoubleIcon, ...props}: Props) {
    return (
        <button className={`${className} ${styles.runButton}`}
            {...props}>
            <img className={isDoubleIcon ? styles.mainIcon : ''}
                src="/icons/play-solid.svg"
                alt="Run" />
            {isDoubleIcon &&
                <img className={styles.additionalIcon}
                    src="/icons/play-solid.svg"
                    alt="Run"/>}
        </button>
    )
}
