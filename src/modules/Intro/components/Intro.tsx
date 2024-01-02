import Image from 'next/image'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import styles from '../styles/Intro.module.scss'

export default function Intro(){
    return (
        <div>
            <Parallax pages={1} style={{ top: '0', left: '0' }}>
                <ParallaxLayer offset={0} speed={0.4}>
                    <div className={styles.dudeContainer}>
                        <Image alt={'dude-celebrating'}
                            src={'/characters/dude-celebrating.webp'}
                            width={413} height={604}
                            className={styles.dude}/>
                    </div>
                </ParallaxLayer>
            </Parallax>
        </div>
    )
}
