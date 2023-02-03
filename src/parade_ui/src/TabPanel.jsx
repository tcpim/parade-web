import { Link } from "react-router-dom";
import PlugConnect from '@psychedelic/plug-connect';

export const TabPanel = (props) => {
  const connectionStatus = props.isConnected;
  const network = "https://mainnet.dfinity.network/";


  const canisterWhitelist = [
    // 'qcg3w-tyaaa-aaaah-qakea-cai',
    // 'y3b7h-siaaa-aaaah-qcnwa-cai',
    // '2tvxo-eqaaa-aaaai-acjla-cai',
    // 'jmuqr-yqaaa-aaaaj-qaicq-cai',
    // 'ca4b4-uyaaa-aaaal-aac7a-cai',
    // 'xkbqi-2qaaa-aaaah-qbpqq-cai',
    // 'lqp4q-iqaaa-aaaak-aakga-cai',
    // 'l22ez-fqaaa-aaaah-qcwiq-cai',
    // 'v7vsu-wqaaa-aaaai-qhpsa-cai',
    // 'b547e-maaaa-aaaam-qadga-cai',
    // 'iiibs-tqaaa-aaaak-aab6q-cai',
    "jmuqr-yqaaa-aaaaj-qaicq-cai",
    "ahl3d-xqaaa-aaaaj-qacca-cai", // ICTuts
    "nbg4r-saaaa-aaaah-qap7a-cai", // startverse
  ];

  const showConnectionButton = () => {
    if (connectionStatus) {
      return <p>You are connected: {window.ic.plug.principalId}</p>
    }
    return (
      <PlugConnect
        //host={network}
        whitelist={canisterWhitelist}
        onConnectCallback={props.afterConnect}
      />
    );

  };

  return (
    <div>
      <span>
        <nav
          style={{
            borderBottom: "solid 1px",
            paddingBottom: "1rem",
          }}
        >
          <Link to="/profile">Profile</Link> |{" "}
          <Link to="/streets">Streets</Link>
        </nav>
      </span>
      <span>
        {showConnectionButton()}
      </span>
    </div>

  );
}