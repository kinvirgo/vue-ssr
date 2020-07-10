import { UPDATE_INITIAL_STATE } from "./types"

export default {
    [UPDATE_INITIAL_STATE](state, payload){
        state.__INITIAL_STATE__ = payload || null
    }
}
