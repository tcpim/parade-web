import { Principal } from '@dfinity/principal';
import { getAllUserNFTs, getNFTInfo, getNFTActor } from '@psychedelic/dab-js';
import { HttpAgent } from '@dfinity/agent';
import { useState, useEffect } from "react";
import { NftRow } from './NftRow'

const AGENT = new HttpAgent({ host: 'https://ic0.app' });

export const ShowNFTs = (props) => {
  const [collectionArray, setCollectionArray] = useState(null);
  const [queriedCanisterId, setqueriedCanisterId] = useState();
  const [queriedCollectionInfo, setQueriedCollectionInfo] = useState({});
  const isConnected = props.isConnected;

  async function fetch() {
    const plugPrincipal = window.ic.plug.principalId;
    //const plugPrincipal = 'dt6hm-ehioi-scl5p-lcl2v-jlti3-iexjx-rbzfn-cb4dc-tru44-jex2a-hae';
    const stoicPrincipal = 'yrwna-bkgxs-vuzuw-lheqr-357oj-n4yiz-2zdjx-icv63-jgoqb-pmf3m-qqe';
    const collectionsPlug = await getAllUserNFTs({
      agent: AGENT,
      user: plugPrincipal
    });

    // const collectionsStoic = await getAllUserNFTs({
    //   agent: AGENT,
    //   user: stoicPrincipal
    // });
    setCollectionArray(collectionsPlug);
  }

  useEffect(() => {
    if (isConnected) {
      fetch();
    }
  }, [isConnected]);



  const handleNFTInfoFormSubmit = (event) => {
    getNFTInfo({
      agent: AGENT,
      nftCanisterId: queriedCanisterId,
    }).then((collection) => {
      setQueriedCollectionInfo({
        icon: collection.icon,
        name: collection.name,
        description: collection.description,
        principal_id: collection.principal_id,
        standard: collection.standard,
      });
    });

    event.preventDefault();
  };

  const getNFTInfoForm = (
    <div>
      <form onSubmit={handleNFTInfoFormSubmit}>
        <label>
          NFT Canister ID:
          <input type="text" value={queriedCanisterId} onChange={(event) => setqueriedCanisterId(event.target.value)} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );

  const showQueriedCollectionInfo = (
    <div>
      <ul>
        <li>icon: {queriedCollectionInfo.icon}</li>
        <li>name: {queriedCollectionInfo.name}</li>
        <li>description: {queriedCollectionInfo.description}</li>
        <li>principal_id: {queriedCollectionInfo.principal_id?.toText()}</li>
        <li>standard: {queriedCollectionInfo.standard}</li>
      </ul>
    </div>
  );

  const getCollectionTable = (collectionArray) => {
    return collectionArray.map((collection) => {
      return (
        <div>
          <h1>{collection.name}</h1>
          <ul>
            <li>canisterId: {collection.canisterId}</li>
            <li>standard: {collection.standard}</li>
            <li>icon: {collection.icon}</li>
            <li>description: {collection.description}</li>
          </ul>
          <ul>
            {collection.tokens.map((token) => getTokenRow(token, collection))}
          </ul>
        </div>
      );
    });

  };

  const getTokenRow = (token, collection) => {
    return <NftRow token={token} collection={collection} />;
  };

  // data will be null when fetch call fails
  if (collectionArray) {

    return (
      <div>
        {getNFTInfoForm}
        {queriedCollectionInfo.icon && showQueriedCollectionInfo}
        <span>I have {collectionArray.length} collections</span>
        {getCollectionTable(collectionArray)}
      </div>

    );
  } else if (!isConnected) {
    return (
      <span>Please connect to Plug</span>
    );
  } else {
    return (
      <span>Loading...Please wait</span>
    );
  }
};