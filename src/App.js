import { Container } from "react-bootstrap";
import OrderEntry from "./pages/entry/OrderEntry";
import { OrderDetailsProvider } from "./contexts/OrderDetails";
import { useState } from "react";
import OrderSummary from "./pages/summary/OrderSummary";
import OrderConfirmation from "./pages/confirmation/orderConfirmation";

function App() {
  // orderPhase needs to be 'inProgress', 'review' or 'completed'
  const [orderPhase, setOrderPhase] = useState("inProgress");

  let Component = OrderEntry; // default to order page
  switch (orderPhase) {
    case "inProgress":
      Component = OrderEntry;
      break;
    case "review":
      Component = OrderSummary;
      break;
    case "completed":
      Component = OrderConfirmation;
      break;
    default:
  }
  return (
    <OrderDetailsProvider>
      <Container>
        {/* Summary page and entry need provider */}
        <Component setOrderPhase={setOrderPhase} />
        {/* confirmation page doesn't need provider */}
      </Container>
    </OrderDetailsProvider>
  );
}

export default App;
