import { useMemo } from 'react';
import {createActor} from '../../backend_declarations/main_server';
import {MAIN_SERVER_CANISTER} from '../../backend_declarations/config'

export const useMainServer = () => {
    return useMemo(() => createActor(MAIN_SERVER_CANISTER), []);
}
