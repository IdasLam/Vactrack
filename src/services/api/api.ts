const isProd = window.location.hostname !== 'localhost'
const host = window.location.hostname
const port = isProd ? '' : ':3001'
const subdomain = isProd ? 'api.' : ''
const protocal = isProd ? 'https:' : 'http:'

export const url = `${protocal}//${subdomain}${host}${port}`
