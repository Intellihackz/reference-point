import PublishForm from "./PublishForm";

export const metadata = { title: "Publish | Reference Point" };

export default function Page() {
  return (
    <main className="wrap">
      <p className="eyebrow">
        <a href="/">Reference Point</a>
      </p>
      <h1>Get paid when AI uses your work</h1>
      <p className="lede">Publish once. Every time an agent pays to use it as a reference, the USDC goes straight to your wallet.</p>
      <PublishForm />
    </main>
  );
}
