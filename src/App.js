import ToolNavigator from "./components/ToolNavigator";
import { AuthContextProvider } from "./context/AuthContext";

function App() {
	return (
		<>
			<AuthContextProvider>
				<ToolNavigator />
			</AuthContextProvider>
		</>
	);
}

export default App;
