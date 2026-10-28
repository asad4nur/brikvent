import Navbar from "@/components/navbar";

export default function HomeLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
