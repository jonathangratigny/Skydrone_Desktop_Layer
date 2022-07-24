export const displayDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : null
}

export const displayTime = (date) => {
    return date ? new Date(date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}) : null
}
