import { Dialog } from "primereact/dialog";
import Image from "next/image";
import etherlinkSpinner from "../../public/images/logo.webp";

interface LoadingModalProps {
  loading: boolean;
  selectedToken: string;
}

const LoadingModal = ({ loading, selectedToken }: LoadingModalProps) => {
  const onHide = () => {}; // Define a no-operation function for onHide

  return (
    <Dialog closable={false} visible={loading} style={{ width: "50vw" }} onHide={onHide}>
      <Image width={200} height={200} src={etherlinkSpinner} alt="Loading spinner" id="loading" className="text-center mx-auto" />
      <p className="text-center font-medium mt-4">Drip! Drip! Dripping you some {selectedToken}&apos;s.... </p>
    </Dialog>
  );
};

export default LoadingModal;
