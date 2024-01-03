import RunUpdateAllButton from "./RunUpdateAllButton"
import styles from "../styles/UpdateAllSnapshotsPanel.module.scss"

export default function UpdateAllSnapshotsPanel(){
    return (
        <div className={styles.updateAllSnapshotsPanel}>
            <span>For all pages: </span>
            <RunUpdateAllButton/>
            <RunUpdateAllButton updateDesigns/>
        </div>
    )
}
