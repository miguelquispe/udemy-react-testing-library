import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import { OrderDetailsProvider } from "../../../contexts/OrderDetails";
import Options from "../Options";
import OrderEntry from "../OrderEntry";

test("update scoop subtotal when scoops change", async () => {
  render(<Options optionType="scoops" />);

  // make sure total starts out $0.00
  const scoopsSubtotal = screen.getByText("Scoops total: $", { exact: false });
  expect(scoopsSubtotal).toHaveTextContent("0.00");

  // update vanilla scoops to 1 and check the subtotal
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await userEvent.clear(vanillaInput);
  await userEvent.type(vanillaInput, "1");
  expect(scoopsSubtotal).toHaveTextContent("2.00");

  // update chocolate scoops to 2 and check subtotal
  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  await userEvent.clear(chocolateInput);
  await userEvent.type(chocolateInput, "2");
  expect(scoopsSubtotal).toHaveTextContent("6.00");
});

test("update topping subtotal when toppings change", async () => {
  const user = userEvent.setup();
  render(<Options optionType="toppings" />);
  const toppingsSubtotal = screen.getByText("Toppings total: $", {
    exact: false,
  });
  expect(toppingsSubtotal).toHaveTextContent("0.00");

  // add cherries to subtotal
  const cherriesCheckbox = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  await user.click(cherriesCheckbox);
  expect(toppingsSubtotal).toHaveTextContent("1.50");

  // add hot fudge to subtotal
  const hotFudgeCheckbox = await screen.findByRole("checkbox", {
    name: "Hot fudge",
  });
  await user.click(hotFudgeCheckbox);
  expect(toppingsSubtotal).toHaveTextContent("3.00");

  // remove hot fudge and check subtotal
  await user.click(hotFudgeCheckbox);
  expect(toppingsSubtotal).toHaveTextContent("1.50");
});

describe("grand total", () => {
  test("grand total updates properly if scoop is added first", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const grandTotal = screen.getByRole("heading", { name: /Grand total: \$/ });
    expect(grandTotal).toHaveTextContent("0.00");

    // add scoop item
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await userEvent.clear(vanillaInput);
    await userEvent.type(vanillaInput, "2");

    expect(grandTotal).toHaveTextContent("4.00");

    const cherriesCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });

    await user.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent("5.50");
  });

  test("grand total updates properly if topping is added first", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const grandTotal = screen.getByRole("heading", { name: /Grand total: \$/ });
    const cherriesCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });

    await user.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent("1.50");

    // add topping item
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await userEvent.clear(vanillaInput);
    await userEvent.type(vanillaInput, "2");

    expect(grandTotal).toHaveTextContent("5.50");
  });

  test("grand total updates properly if item is removed", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    // add cherries
    const cherriesCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    await user.click(cherriesCheckbox);
    // grand total:  $1.50

    // add scoop
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "2");
    // grand total: 5.50

    // remove 1 scoop of vanilla and check total
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");
    // grand total: 3.50

    // check grand total
    const grandTotal = screen.getByRole("heading", { name: /Grand total: \$/ });
    expect(grandTotal).toHaveTextContent("3.50");

    // remove toppings (cherries)
    await user.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent("2.00");
  });
});
