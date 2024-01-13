import BuyMeACoffeeWidget from '@components/BuyMeACoffeeWidget'
import styles from '../styles/Header.module.scss'

export default function Header(){
    return (
        <div className={styles.header}>
            <BuyMeACoffeeWidget/>
        </div>
    )
}
