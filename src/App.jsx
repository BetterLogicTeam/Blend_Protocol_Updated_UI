import "./App.css";
import Presale from "./components/Presale";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <main className="overflow-hidden">
       <Toaster />
      <div className="h-[500px] w-[500px] bg-accent rounded-full filter blur-[500px] fixed -top-1/2 -left-[40px]" />
      <Header />
      <Presale/>
      
    </main>
  );
}

export default App;
