export const createElements = (elements) => {
    let destructuring = {}
    elements.forEach(element => {
        const key = element
        destructuring[key] = document.createElement(element);
    })
    return destructuring
}