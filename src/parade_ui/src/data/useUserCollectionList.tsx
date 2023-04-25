import { useQuery } from 'react-query';

export interface CollectionListData {
    result: Collection[]
}

export interface Collection {
    canisterId: string;
    tokenList: Token[];
}

export interface Token {
    index: number;
    identifier: string;
    originalImage: string;
    smallImage: string;
}

const paradeApiHost = 'https://parade-api-7fuobxt2ia-uw.a.run.app/';

const fetchUserCollectionList = async (): Promise<CollectionListData> => {
    const response = await fetch(paradeApiHost);
    if (!response.ok) {
        throw new Error('Error fetching user collection list data');
    }
    const data: CollectionListData = await response.json();
    return data;
};

export const useUserCollectionList = () => {
    return useQuery<CollectionListData, Error>('userCollectionList', fetchUserCollectionList);
};