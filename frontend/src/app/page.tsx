import Navbar from "@/app/ui/navbar";
import Footer from "@/app/ui/footer";

export default function Home() {
  return (
    <div className='flex flex-col'>
      <header className='w-full h-[8vh]'>
        <Navbar />
      </header>
      <main className='w-full h-[84vh]'>
        This is the main body of the website.
      </main>
      <footer className='w-full h-[8vh]'>
        <Footer />
      </footer>
    </div>
  );
}
