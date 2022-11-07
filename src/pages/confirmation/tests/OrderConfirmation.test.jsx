import { render, screen } from "../../../test-utils/testing-library-utils";
import { rest } from "msw";
import { server } from "../../../mocks/server";
import OrderConfirmation from "../orderConfirmation";

test("error response from server for submiting order", async () => {
  // override the default msw response for options endpoint with error response
  server.resetHandlers(
    rest.post("http://localhost:3030/order", (req, res, ctx) =>
      res(ctx.status(500))
    )
  );

  // provide props when use typescript
  render(<OrderConfirmation setOrderPhase={jest.fn()} />);

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(
    "An unexpected error ocurred. Please try again later."
  );
});
