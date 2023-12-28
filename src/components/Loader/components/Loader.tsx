import React, {useEffect, useState} from "react"
import styles from '../styles/Loader.module.scss'
import {createPortal} from "react-dom"
import useGlobalLoader from "../../../store/globalLoaderStore"

function Loader(){
    const [mounted, setMounted] = useState(false);
    const [globalLoader, _] = useGlobalLoader()

    useEffect(() => setMounted(true), []);

    return mounted ? createPortal((
        <div className={`${styles.loader} ${globalLoader.showLoader ? '' : styles.hidden}`}>
            <span>{globalLoader.text}</span>
        </div>
    ),
        document.getElementById('loader-root') || document.body
    ): null
}

export default Loader
