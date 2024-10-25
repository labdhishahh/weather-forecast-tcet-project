import Weather from "./Weather";
import Footer from "./Footer";

import "../css/App.css";

function App() {
  return (
    <div className="App">
      <div className="container">
        <Weather defaultCity="London" />
      </div>
      <Footer />
    </div>
  );
}

export default App;