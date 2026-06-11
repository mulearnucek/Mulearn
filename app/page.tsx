// import { Helmet, HelmetProvider } from "react-helmet-async";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import About from "./Components/About/About";
import Events from "./Components/Events/Events";
import Gallery from "./Components/Gallery/Gallery";
import Statistics from "./Components/Statistics/Statistics";
import ExploreLC from "./Components/ExploreLC/ExploreLC";
import Connect from "./Components/Connect/Connect";
import Footer from "./Components/Footer/Footer";
import Achievements from "./Components/Achievements/Achievements";

export const revalidate = 0;

function App() {
  return (
    <div className="appWrapper">
      <Navbar />
      <Home />
      <About />
      <Achievements />
      <Events />
      <Gallery />
      <Statistics />
      <ExploreLC />
      <Connect />
      <Footer />
    </div>
  );
}

export default App;
