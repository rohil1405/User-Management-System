import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./style.css";
import "./media.css";
import "./header.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);