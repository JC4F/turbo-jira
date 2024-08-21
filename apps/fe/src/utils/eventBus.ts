import Mitt from 'mitt'

type Events = { [key: string]: any }

export const eventBus = Mitt<Events>()
