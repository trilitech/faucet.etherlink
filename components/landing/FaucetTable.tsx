import { eUSD_ADDRESS, USDT_ADDRESS, USDC_ADDRESS, BTC_ADDRESS, ETH_ADDRESS } from "../../constants/addresses";
import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/viva-dark/theme.css";
import xtz from "../../public/images/token-icons/xtz.svg";
import usdc from "../../public/images/token-icons/usdc.svg";
import usdt from "../../public/images/token-icons/usdt.svg";
import eth from "../../public/images/token-icons/eth.svg";
import bitcoin from "../../public/images/token-icons/bitcoin.svg";
import eusd from "../../public/images/token-icons/eusd.svg";
import Image from "next/image";
import { useWeb3Context } from "../../context/Web3Context";
import { calculateOverrideValues } from "next/dist/server/font-utils";
import ReCAPTCHA from "react-google-recaptcha";

interface FaucetTableProps {
  loadingDrip: boolean;
  drip: (address: string) => void;
  loadingBalances: boolean;
  userBalances: number[];
  setSelectedToken: (token: string) => void;
}

interface TokenData {
  token: string;
  balance: number;
  img: any;
  address: string;
}

const FaucetTable = ({ loadingDrip, drip, loadingBalances, userBalances, setSelectedToken }: FaucetTableProps) => {

  // collecting state
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const context = useWeb3Context();
  let address = "";
  let isConnected = false;
  let currentChain = 0;

  // internal state
  const [captchaCompleted, setCaptchaCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState("")

  if (context && 'state' in context) {
    const { state: { address: addr } } = context;
    address = addr || "";
    isConnected = context.state.isAuthenticated;
    currentChain = context.state.currentChain || 0;
  }

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (userBalances?.length > 0) {
        const data = [
          {
            token: "XTZ",
            balance: 0,
            img: xtz,
            address: "",
          },

          {
            token: "eUSD",
            balance: userBalances[0],
            img: eusd,
            address: eUSD_ADDRESS,
          },
          {
            token: "USDT",
            balance: userBalances[1],
            img: usdt,
            address: USDT_ADDRESS,
          },
          {
            token: "USDC",
            balance: userBalances[2],
            img: usdc,
            address: USDC_ADDRESS,
          },

          {
            token: "BTC",
            balance: userBalances[3],
            img: bitcoin,
            address: BTC_ADDRESS,
          },
          {
            token: "ETH",
            balance: userBalances[4],
            img: eth,
            address: ETH_ADDRESS,
          },
        ];
        setTokens(data);
      }
    }

    return () => { mounted = false };
  }, [userBalances]);

  const callFaucet = async () => {
    const body = JSON.stringify({ walletAddress: address });
    setIsLoading(true);
    const response = await fetch('/api/faucet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (response.ok) {
      const data = await response.json();
      setTxHash(data.body.receipt.transactionHash);
      console.log("txHash; " + data.body.receipt.transactionHash);
    } else {
      console.error('Error:', response.status);
    }
  };

  const CallFaucetButton = () => {
    if (isConnected && currentChain === 128123) {
      return (
        <button
          onClick={txHash ? () => window.open(`https://explorer.etherlink.com/tx/${txHash}`, '_blank') : callFaucet}
          disabled={isLoading || !captchaCompleted}
          className={`flex flex-row items-center justify-center py-3 text-lg font-medium text-center text-black bg-white border-solid border-2 border-black rounded-md px-7 lg:px-6 lg:py-4 hover:bg-darkGreen hover:border-black hover:text-white ${isLoading || !captchaCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? <>
            <Image
              src="/img/home/logo.png"
              alt="Loading..."
              width={32}
              height={32}
              className={`w-8 mr-2 ${isLoading ? 'spin-logo' : ''}`}
            />
            Loading...
          </> : txHash ?
            <>
              <Image
                src="/img/home/logo.png"
                alt="logo"
                width={32}
                height={32}
                className="w-8 mr-2"
              />
              {`${txHash.slice(0, 6)}...${txHash.slice(-4)}`}
            </> :
            `Start with XTZ`}
        </button>
      );
    } else {
      return null;
    }
  }

  const CaptchaButton = () => {
    if (isConnected && currentChain === 128123) {
      return (
        <ReCAPTCHA
          sitekey="6Lcbu-AoAAAAAOPS85LI3sqIvAwErDKdtZJ8d1Xh"
          onChange={() => setCaptchaCompleted(true)}
          onExpired={() => setCaptchaCompleted(false)}
          className="mt-10 mb-10"
          theme="dark"
        />
      );
    } else {
      return null; // Explicitly return null instead of false
    }
  };

  const dripColumnTemplate = (rowData: TokenData) => {
    if (rowData.token !== "XTZ") {
      return (
        <button
          onClick={() => {
            drip(rowData.address);
            setSelectedToken(rowData.token);
          }}
          className="bg-darkGreen hover:bg-gray-700 hover:font-medium shadow-md ease-in-out duration-200 rounded-md px-6 py-2 flex items-center w-40 justify-center"
        >
          Drip
        </button>
      );
    } else {
      return (
        // <button
        //   onClick={() => {
        //     callFaucet();
        //     setSelectedToken(rowData.token);
        //   }}
        //   className="bg-darkGreen hover:bg-gray-700 hover:font-medium shadow-md ease-in-out duration-200 rounded-md px-6 py-2 flex items-center"
        // >
        //   Start with XTZ
        // </button>
        <>
          <CaptchaButton />
          <CallFaucetButton />
        </>
      );
    }
  };

  const tokenColumnTemplate = (rowData: TokenData) => {
    return (
      <button className="rounded-md px-6 py-2 flex items-center">
        <Image src={rowData.img} width={10} alt={rowData.token} className="bg rounded-full h-8 w-8 px-1 py-1 mr-2" />
        {rowData.token}
      </button>
    );
  };

  const balanceColumnTemplate = (rowData: TokenData) => {
    return (
      <span className="font-bold">{userBalances.length < 1 ? "loading" : rowData.balance + " " + rowData.token}</span>
    );
  };

  return (
    <div className="card text-white max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mt-20 mb-3">Faucet</h2>
      {tokens && (
        <DataTable
          value={tokens}
          tableStyle={{ minWidth: "50rem" }}
          className="max-w-4xl rounded-md"
          emptyMessage="Connect your wallet to get Started."
        >
          <Column field="token" header="Token" body={tokenColumnTemplate}></Column>
          <Column field="balance" header="User balance" body={balanceColumnTemplate}></Column>
          <Column field="drip" header="Drip" body={dripColumnTemplate}></Column>
        </DataTable>
      )}
    </div>
  );
};

export default FaucetTable;
