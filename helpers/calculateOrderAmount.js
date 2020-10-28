module.exports = (items) => {
    return items.reduce((total, item) => {
        return total + item.price
    }, 0);
}