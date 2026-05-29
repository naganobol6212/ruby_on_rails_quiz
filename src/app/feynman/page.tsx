import { FeynmanTrainer } from "./FeynmanTrainer";

export const metadata = {
  title: "ファインマン・テクニック演習 — CodeDojo",
};

export default function FeynmanPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8 sm:py-10">
      <FeynmanTrainer />
    </div>
  );
}
