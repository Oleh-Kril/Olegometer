type Action = {
    type: string,
    className: string
}

interface DynamicElement {
    actions: Action[],
    elementToCapture: {
        className: string
    },
}
