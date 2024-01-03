interface DynamicElement {
    actions: {
        type: string,
        className: string
    }[],
    elementToCapture: {
        className: string
    },
}
