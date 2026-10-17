import { Footer, Nav } from "../components/Chrome";
import PublishForm from "./PublishForm";

export const metadata = { title: "Publish | Reference Point" };

export default function Page() {
  return (
    <>
      <Nav />
      <main className="wrap">
        <h1 className="page-title">Publish your work</h1>
        <p className="lede">Set a price once. Every time an agent pays to use it as a reference, the USDC goes straight to your wallet.</p>
        <PublishForm />
      </main>
      <Footer />
    </>
  );
}
