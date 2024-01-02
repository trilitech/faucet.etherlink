import Image from "next/image"
import { useWeb3Context } from "../../context/Web3Context";

const callFaucet = async () => {
  const context = useWeb3Context();
  if (!context) {
    console.error('Web3Context is null');
    return;
  }
  const { state: { address } } = context;
  const body = JSON.stringify({ walletAddress: address });
  // setIsLoading(true);
  const response = await fetch('/api/faucet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body,
  });

  if (response.ok) {
    const data = await response.json();
    console.log("txHash; " + data.body.receipt.transactionHash);
    // setTxHash(data.body.receipt.transactionHash);
    // setTokensClaimed(true);
  } else {
    console.error('Error:', response.status);
  }
}

// const ClaimButton = ({ walletStatus, captchaCompleted }) => {
//     return (
//       walletStatus === "connected" && chainId === 128123 ?
//         <button
//           onClick={txHash ? () => window.open(`https://explorer.etherlink.com/tx/${txHash}`, '_blank') : callFaucet}
//           disabled={isLoading || !captchaCompleted}
//           className={`flex flex-row items-center justify-center py-3 text-lg font-medium text-center text-black bg-white border-solid border-2 border-black rounded-md px-7 lg:px-6 lg:py-4 hover:bg-darkGreen hover:border-black hover:text-white ${isLoading || !captchaCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
//         >
//           {isLoading ? <>
//             <Image
//               src="/img/home/logo.png"
//               alt="Loading..."
//               width={32}
//               height={32}
//               className={`w-8 mr-2 ${isLoading ? 'spin-logo' : ''}`}
//             />
//             Loading...
//           </> : txHash ?
//             <>
//               <Image
//                 src="/img/home/logo.png"
//                 alt="logo"
//                 width={32}
//                 height={32}
//                 className="w-8 mr-2"
//               />
//               {`${txHash.slice(0, 6)}...${txHash.slice(-4)}`}
//             </> :
//             `Send 0.1 XTZ to ${shortAddress}`}
//         </button> : ""
//     )
// }

export default callFaucet;

