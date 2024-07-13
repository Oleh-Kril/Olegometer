import styles from '../styles/FlexContainer.module.scss'

export default function FlexContainer(props: any) {
    return (
        <div className={styles.container}
            {...props}>
        </div>
    )
}
