import { Navbar } from "@/components/layout/Navbar";

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
