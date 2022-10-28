import { Container } from "react-bootstrap";
import OrderEntry from "./pages/entry/OrderEntry";
import { OrderDetailsProvider } from "./contexts/OrderDetails";

function App() {
  return (
    <Container>
      <OrderDetailsProvider>
        {/* Summary page and entry need provider */}
        <OrderEntry />
        {/* confirmation page doesn't need provider */}
      </OrderDetailsProvider>
    </Container>
  );
}

export default App;
