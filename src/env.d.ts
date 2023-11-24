declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string,
            PNW_API_KEY: string,
        }
    }
}

export { }