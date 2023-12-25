export default function transformIdProperty<T extends { _id: any }>(obj: T): Omit<T, '_id'> & { id: string } {
    const { _id, ...rest } = obj
    return { ...rest, id: _id.toString() }
}
