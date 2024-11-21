import env from 'dotenv'
env.config()

export const port = process.env.PORT
export const token = process.env.TOKEN
export const oneDay = 24 * 60 * 60 * 1000
export const jwtKey = process.env.JWT_KEY
export const channelId = process.env.CHANNEL_ID